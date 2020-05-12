<?php
/*
 * Copyright 2015 Smithsonian Institution.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.You may obtain a copy of
 * the License at: http://www.apache.org/licenses/
 *
 * This software and accompanying documentation is supplied without
 * warranty of any kind. The copyright holder and the Smithsonian Institution:
 * (1) expressly disclaim any warranties, express or implied, including but not
 * limited to any implied warranties of merchantability, fitness for a
 * particular purpose, title or non-infringement; (2) do not assume any legal
 * liability or responsibility for the accuracy, completeness, or usefulness of
 * the software; (3) do not represent that use of the software would not
 * infringe privately owned rights; (4) do not warrant that the software
 * is error-free or will be maintained, supported, updated or enhanced;
 * (5) will not be liable for any indirect, incidental, consequential special
 * or punitive damages of any kind or nature, including but not limited to lost
 * profits or loss of data, on any basis arising from contract, tort or
 * otherwise, even if any of the parties has been warned of the possibility of
 * such loss or damage.
 *
 *
 * This distribution includes several third-party libraries, each with their own
 * license terms. For a complete copy of all copyright and license terms, including
 * those of third-party libraries, please see the product release notes.
 */

/* Show the form used to delete a XSL file  */
function sidora_delete_xsl_form($form,&$form_state) {
  $form = array();
  $xsl_filenames = sidora_get_all_xsl_names();
  $xsl_names_dd = '<select class="xsl-names-dd form-select">';
  $xsl_names_dd .= '<option value="">None - Direct metadata to browser</option>';
  $xsl_form_dropdown = array();
  foreach ($xsl_filenames as $name) {
      $xsl_names_dd .= '<option value="'.$name.'">'.$name.'</option>';
      $xsl_form_dropdown[$name] = $name;
  }
  $xsl_names_dd .= '</select>';
 // need to add the ui-dialog library here to be able to create a dialog box inside the Delete XSL Shadowbox
  drupal_add_library('system','ui.dialog');
  $js_for_form = '<script>
  jQuery(document).ready(function() {
  jQuery("body").css("padding-top","0px");
  jQuery("#confirm-delete").click(function(e) {
      e.preventDefault();
      todelete = jQuery("#xsl-to-delete").val();
      jQuery("#deleteXSLdialog").remove();
      jQuery("body").append("<div id=\'deleteXSLdialog\' style=\'display:none;\' title=\'Delete XSL\'><p>Are you sure you want to delete this XSL?</p><p>"+jQuery("#xsl-to-delete").val()+"</p></div>");
      jQuery("#deleteXSLdialog").dialog({
      height: 300,
      width: 350,
      modal: true,
      resizable: false,
      buttons: {
        "Delete XSL": function() {
          var toClose = this;
          var onDeleteWorked = function() {
            jQuery( toClose ).dialog( "close" );
            jQuery("#deleteXSLConfirm").remove();
            /*jQuery("body").append("<div title=\'XSL Deleted\' id=\'deleteXSLConfirm\'><p>XSL Deleted</p><div>");
            jQuery("#deleteXSLConfirm").dialog({
              resizable:false, modal:true
            }); */
            self.parent.Shadowbox.close();
          }
          var onDeleteFailed = function(data) {
            jQuery( toClose ).dialog( "close" );
            jQuery("#deleteXSLConfirm").remove();
            jQuery("body").append("<div title=\'XSL Not Deleted\' id=\'deleteXSLConfirm\'><p>XSL Not Deleted</p><div>");
            jQuery("#deleteXSLConfirm").dialog({
              resizable:false, modal:true
            });
          };
          deleteXSLfunction(todelete,onDeleteWorked,onDeleteFailed);
        },
        Cancel: function() {
          jQuery( this ).dialog( "close" );
        }
      }
    });
  });
    jQuery("#cancel-btn").click(function() {
      self.parent.Shadowbox.close();
    });
  deleteXSLfunction =function(todelete, onDeleteWorked, onDeleteFailed) {
     var url = Drupal.settings.basePath+"sidora/ajax_parts/delete_xsl_file/"+todelete;
     jQuery.ajax ({
      type: "POST",
      url: url,
      data: todelete,
      success: onDeleteWorked,
      error: onDeleteFailed,
      dataType: "text"
    });
  }
});
</script>';
  $form['hidden_js'] = array(
    '#type' => 'hidden',
    '#suffix' => $js_for_form
  );
  $form['xsl_to_delete']= array(
    '#type'=>'select',
    '#title'=>t('Select a XSL file to delete'),
    '#options'=>$xsl_form_dropdown,
    '#attributes'=>array("id" => "xsl-to-delete")
  );

  $form['submit-btn']=array(
    '#type'=>'button',
    '#value'=>t('Delete'),
    '#attributes' => array("id" => "confirm-delete")
  );
  $form['cancel-btn'] = array(
    '#type' => 'button',
    '#value' => t('Cancel'),
    '#attributes' => array("id" => "cancel-btn")
  );
  return $form;
}

/*
 * Direct output to browser for the XSL for the pid, or the configuration about the XSL information for the pid
 */
function sidora_xsl_information($pid, $return_file_content = FALSE) {
  $xsl_config = sidora_get_xsl_file_config_for_object($pid);
  if (empty($xsl_config)) return;
  if ($return_file_content === FALSE) {
    print(json_encode($xsl_config));
  }
  else {
    print(sidora_xsl_string($xsl_config->file));
  }
}

/*
 * Returns the xsl_file_config object for this pid or NULL.  The object returned will have
 * attributes:
 *  ->model - The model that matched between configs and the object models
 *  ->form  - The form that matched between configs and the object models
 *  ->file  - The xsl file set
 * These are the items set in the SIdora configuration
 */
function sidora_get_xsl_file_config_for_object($pid) {
  $xsl_file = '';
  $existing_json_sidora_form_config = variable_get('xsl_form_config', '');
  $sfc = json_decode($existing_json_sidora_form_config);
  // determine the current form and model
  $sidora_data = sidora_get_form_and_dsid($pid);
  $object = sidora_obj($pid);
  if (empty($object)) {
    return NULL;
  }
  $preferred_dsid = $sidora_data['dsid'];
  $form_name = $sidora_data['form_name'];
  $models = $object->models;
  $perfect_match = FALSE;
  // So search through the sfc until you find one that matches
  // Cut out early if a perfect match is found (matches form/model/preferred_dsid)
  $dsid_to_use = '';
  $curr_check = NULL;
  $imperfect_return = NULL;
  $catch_all = NULL;
  for ($sfci = 0; $sfci < _sidora_sizeof($sfc->xsl_config) && !$perfect_match; $sfci++) {
    $curr_check = $sfc->xsl_config[$sfci];
    $model_match = in_array($curr_check->model,$models);
    $form_match = $curr_check->form == $form_name;
    $perfect_match = ($model_match && $form_match);
    if ($curr_check->form == 'sidora_all' && $model_match) {
      $imperfect_return = $curr_check;
    }
    if ($form_match && $curr_check->model == 'sidora_all') {
      $imperfect_return = $curr_check;
    }
    if ($curr_check->form == 'sidora_all' && $curr_check->model == 'sidora_all') {
      $catch_all = $curr_check;
    }
  }
  if ($perfect_match) return $curr_check;
  if (!empty($imperfect_return)) {
    return $imperfect_return;
  }
  return $catch_all;
}

/*
 * Returns the XSL file filename to use for this pid
 */
function sidora_get_xsl_file_for_object($pid) {
  $curr_check = sidora_get_xsl_exhibition_config_for_object($pid);
  if ((!empty($curr_check)) && ($curr_check != 'none') && ($curr_check != 'direct')) {
    return $curr_check;
  }
  $curr_check = sidora_get_xsl_file_config_for_object($pid);
  if (empty($curr_check)) return NULL;
  return $curr_check->file;
}

/*
 * XML to HTML transform based on the SIdora XSL file config.
 * Automatically "even" and "odd" rows that are basic ("<tr>") in tables after transform
 */
function sidora_metadata_to_html_table_transform($xml, $xsl_file) {
  $doc = new DOMDocument();
  $xsl = new XSLTProcessor();
  $xsl_string = sidora_xsl_string($xsl_file);
  $doc->loadXML($xsl_string);
  $xsl->importStyleSheet($doc);
  if (strpos($xml, "<?xml version") === FALSE) {
    $docToLoad = ('<?xml version="1.0" encoding="UTF-8"?' . '>' . $xml);
  }
  else {
    $docToLoad = $xml;
  }
  $doc->loadXML($docToLoad);
  $initialOutput = $xsl->transformToXML($doc);
  // now go through and add the even/odd classes
  $tableRows = explode("<tr>",$initialOutput);
  $properOutput = $tableRows[0];
  for ($trNum = 1; $trNum < count($tableRows); $trNum++) {
    
  // end one doesn't get a tr
    if ($trNum % 2 == 0) {
      $properOutput .= '<tr class="even">'.$tableRows[$trNum];
    }
    else {
      $properOutput .= '<tr class="odd">'.$tableRows[$trNum];
    }
  }
  return $properOutput;

}

/*
 * Returns a XSL file from the file system or the basic one if no filename used
 */
function sidora_xsl_string($xsl_file) {
  if (empty($xsl_file)) {
    return variable_get('sidora_metadata_xsl',sidora_xsl_string_default());
  }
  $xsl_form_definition = db_query("SELECT form_definition FROM {sidora_xsl} WHERE form_name = :form_name", array(':form_name' => $xsl_file))->fetchField();
  if ($xsl_form_definition) {
    $definition = new DOMDocument();
    $definition->loadXML($xsl_form_definition);
    $definition->formatOutput = TRUE;
    return $definition->saveXML();  
  }
}

/*
 * Returns the default XSL for SIdora objects
 */
function sidora_xsl_string_default() {
  return sidora_xsl_string_default_as_definition_list();
}

/*
 * Returns a hard-coded XSL with dt / dd HTML for basic SIdora objects
 */
function sidora_xsl_string_default_as_definition_list() {
  return '<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:mods="http://www.loc.gov/mods/v3"
xmlns:fits="http://hul.harvard.edu/ois/xml/ns/fits/fits_output"
xmlns:cpf="urn:isbn:1-931666-33-4"
>

<xsl:template match="/">
  <html>
  <body>
  <dl class="metadata-table">
      <xsl:for-each select="xml_root/debug">
    <dt>Debug</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:for-each>
    <xsl:for-each select="//mods:abstract">
    <xsl:if test="current()!=\'\'">
    <dt>Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:subject/mods:topic">
    <xsl:if test="current()!=\'\'">
    <dt>Topic</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:subject/mods:geographic">
    <xsl:if test="current()!=\'\'">
    <dt>Geographic</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:name">
      <xsl:for-each select="mods:namePart">
        <xsl:if test="current()!=\'\'">
        <dt>Name</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
      </xsl:for-each>
      <xsl:for-each select="mods:role/mods:roleTerm">
        <xsl:if test="current()!=\'\'">
        <dt>Role</dt><dd><xsl:value-of select="current()"/></dd>
                </xsl:if>
      </xsl:for-each>
    </xsl:for-each>
 <xsl:for-each select="//mods:identifier">
    <xsl:if test="current()!=\'\'">
    <dt>Identifier</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:genre">
    <xsl:if test="current()!=\'\'">
    <dt>Genre</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:note[not(@*)]">
    <xsl:if test="current()!=\'\'">
    <dt>Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:originInfo/mods:dateCaptured">
    <xsl:if test="current()!=\'\'">
    <dt>Date Captured</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:physicalLocation">
    <xsl:if test="current()!=\'\'">
    <dt>Physical Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
 <xsl:for-each select="//mods:copyInformation/mods:subLocation">
    <xsl:if test="current()!=\'\'">
    <dt>Sub Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//fits:fileinfo/fits:created[@toolname=\'Exiftool\']">
    <xsl:if test="current()!=\'\'">
    <dt>Image Capture Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/title">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Site Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/othercit">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Deployment ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/origin">
    <xsl:if test="current()!=\'\'">
    <dt>Originator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//citeinfo/geoform">
    <xsl:if test="current()!=\'\'">
    <dt>Format of Geospatial Data</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/abstract">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Deployment Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//descript/supplinf">
    <xsl:if test="current()!=\'\'">
    <dt>Purposed Lat and Long</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/latres">
    <xsl:if test="current()!=\'\'">
    <dt>Actual Latitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/longres">
    <xsl:if test="current()!=\'\'">
    <dt>Actual Longitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/lineage/procstep[procdesc=\'Proposed Camera Deployment Begin Date\']/procdate">
    <xsl:if test="current()!=\'\'">
    <dt>Proposed Camera Deployment Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/lineage/procstep[procdesc=\'Proposed Camera Deployment End Date\']/procdate">
    <xsl:if test="current()!=\'\'">
    <dt>Proposed Camera Deployment End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/begdate">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Deployment Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//timeinfo/rngdates/enddate">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Deployment End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Camera ID\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Camera ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Image Resolution Setting\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Image Resolution Setting</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Detection Distance\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Detection Distance</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Sensitivity Setting\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Sensitivity Setting</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Quiet Period Setting\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Quiet Period Setting</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Camera Height\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Height</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//detailed/attr[attrlabl=\'Habitat Type\']/attrdomv/edom/edomv">
    <xsl:if test="current()!=\'\'">
    <dt>Habitat Type</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//theme/themekey">
    <xsl:if test="current()!=\'\'">
    <dt>Theme Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//place/placekey">
    <xsl:if test="current()!=\'\'">
    <dt>Place Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//keywtax/taxonkey">
    <xsl:if test="current()!=\'\'">
    <dt>Taxonomic Keyword</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//taxoncl/taxonrn">
    <xsl:if test="current()!=\'\'">
    <dt>Taxonomic Rank Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//taxoncl/taxonrv">
    <xsl:if test="current()!=\'\'">
    <dt>Taxonomic Rank Value</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/accconst">
    <xsl:if test="current()!=\'\'">
    <dt>Access Constraints</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/useconst">
    <xsl:if test="current()!=\'\'">
    <dt>Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//idinfo/datacred">
    <xsl:if test="current()!=\'\'">
    <dt>Data Set Credit</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//dataqual/complete">
    <xsl:if test="current()!=\'\'">
    <dt>Camera Failure Details</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype=\'Bait\']/methodid/methkey">
    <xsl:if test="current()!=\'\'">
    <dt>Bait Type</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype=\'Bait\']/methdesc">
    <xsl:if test="current()!=\'\'">
    <dt>Bait Methodology</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype=\'feature\']/methodid/methkey">
    <xsl:if test="current()!=\'\'">
    <dt>Feature</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//method[methtype=\'feature\']/methodid/methdesc">
    <xsl:if test="current()!=\'\'">
    <dt>Feature Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/latres">
    <xsl:if test="current()!=\'\'">
    <dt>Actual Latitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/longres">
    <xsl:if test="current()!=\'\'">
    <dt>Actual Longitude</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/horizsys/geograph/geogunit">
    <xsl:if test="current()!=\'\'">
    <dt>Geographic Coordinate Units</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altdatum">
    <xsl:if test="current()!=\'\'">
    <dt>Altitude Datum Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altres">
    <xsl:if test="current()!=\'\'">
    <dt>Elevation</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altunits">
    <xsl:if test="current()!=\'\'">
    <dt>Altitude Distace Units</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//spref/vertdef/altsys/altenc">
    <xsl:if test="current()!=\'\'">
    <dt>Altitude Encoding Method</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metd">
    <xsl:if test="current()!=\'\'">
    <dt>Metadata Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metrd">
    <xsl:if test="current()!=\'\'">
    <dt>Metadata Review Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metfrd">
    <xsl:if test="current()!=\'\'">
    <dt>Metadata Future Review Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntperp/cntper">
    <xsl:if test="current()!=\'\'">
    <dt>Contact Person</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntperp/cntorg">
    <xsl:if test="current()!=\'\'">
    <dt>Organization Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/address">
    <xsl:if test="current()!=\'\'">
    <dt>Address</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/city">
    <xsl:if test="current()!=\'\'">
    <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/state">
    <xsl:if test="current()!=\'\'">
    <dt>State</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntaddr/postal">
    <xsl:if test="current()!=\'\'">
    <dt>Postal Code</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntvoice">
    <xsl:if test="current()!=\'\'">
    <dt>Phone</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metc/cntinfo/cntemail">
    <xsl:if test="current()!=\'\'">
    <dt>Email</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdn">
    <xsl:if test="current()!=\'\'">
    <dt>Metadata Standard Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//metainfo/metstdv">
    <xsl:if test="current()!=\'\'">
    <dt>Metadata Standard Version</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type=\'\']/mods:title">
    <xsl:if test="current()!=\'\'">
    <dt>Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type=\'alternative\']/mods:title">
    <xsl:if test="current()!=\'\'">
    <dt>Alternative Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type=\'uniform\']/mods:title">
    <xsl:if test="current()!=\'\'">
    <dt>Uniform Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type=\'translated\']/mods:title">
    <xsl:if test="current()!=\'\'">
    <dt>Translated Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:titleInfo[@type=\'abbreviated\']/mods:title">
    <xsl:if test="current()!=\'\'">
    <dt>Abbreviated Title</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:identifier[not(@type)]">
    <xsl:if test="current()!=\'\'">
    <dt>Item ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:identifier[@type=\'accessionNumber\']">
    <xsl:if test="current()!=\'\'">
    <dt>Accession / RU</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:role[mods:roleTerm = \'Creator\']/../../mods:name/mods:namePart">
    <xsl:if test="current()!=\'\'">
    <dt>Creator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:role[mods:roleTerm = \'Contributor\']/../../mods:name/mods:namePart">
    <xsl:if test="current()!=\'\'">
    <dt>Contributor</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:typeOfResource">
    <xsl:if test="current()!=\'\'">
    <dt>Type of Resource</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:genre">
    <xsl:if test="current()!=\'\'">
    <dt>Genre</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:mods/mods:abstract">
    <xsl:if test="current()!=\'\'">
    <dt>Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther[@type=\'range\' and not(@point)]">
    <xsl:if test="current()!=\'\'">
    <dt>Date Range</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther[@point=\'start\']">
    <xsl:if test="current()!=\'\'">
    <dt>Start Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther[@point=\'end\']">
    <xsl:if test="current()!=\'\'">
    <dt>End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:dateOther/@qualifier">
    <xsl:if test="current()!=\'\'">
    <dt>Date Qualifier</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:location/mods:physicalLocation">
    <xsl:if test="current()!=\'\'">
    <dt>Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:shelfLocator">
    <xsl:if test="current()!=\'\'">
    <dt>Shelf Locator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:url">
    <xsl:if test="current()!=\'\'">
    <dt>URL</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subLocation">
    <xsl:if test="current()!=\'\'">
    <dt>Sub Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:physicalDescription/mods:form">
    <xsl:if test="current()!=\'\'">
    <dt>Physical Description</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordOrigin">
    <xsl:if test="current()!=\'\'">
    <dt>Record Creator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordContentSource">
    <xsl:if test="current()!=\'\'">
    <dt>Institute Creator</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordCreationDate">
    <xsl:if test="current()!=\'\'">
    <dt>Creation Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:recordInfo/mods:recordChangeDate">
    <xsl:if test="current()!=\'\'">
    <dt>Change Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:accessCondition">
    <xsl:if test="current()!=\'\'">
    <dt>Access Condition</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:note">
    <xsl:if test="current()!=\'\'">
    <dt>Note</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:topic">
    <xsl:if test="current()!=\'\'">
    <dt>Topic</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:geographic">
    <xsl:if test="current()!=\'\'">
    <dt>Geographic Subject</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:continent">
    <xsl:if test="current()!=\'\'">
    <dt>Continent</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:country">
    <xsl:if test="current()!=\'\'">
    <dt>Country</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:province">
    <xsl:if test="current()!=\'\'">
    <dt>State</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:region">
    <xsl:if test="current()!=\'\'">
    <dt>Region</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:county">
    <xsl:if test="current()!=\'\'">
    <dt>County</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:city">
    <xsl:if test="current()!=\'\'">
    <dt>City</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:hierarchicalGeographic/mods:citySection">
    <xsl:if test="current()!=\'\'">
    <dt>City Section</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:cartographics/mods:coordinates">
    <xsl:if test="current()!=\'\'">
    <dt>Coordinates</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type=\'conference\']/mods:namePart">
    <xsl:if test="current()!=\'\'">
    <dt>Expedition Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type=\'corporate\' and @displayLabel=\'Vessel\']/mods:namePart">
    <xsl:if test="current()!=\'\'">
    <dt>Vessel Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type=\'corporate\' and @displayLabel=\'Organization\']/mods:namePart">
    <xsl:if test="current()!=\'\'">
    <dt>Organization Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:subject/mods:name[@type=\'personal\']/mods:namePart">
    <xsl:if test="current()!=\'\'">
    <dt>Person Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:relatedItem/mods:titleInfo/mods:title">
    <xsl:if test="current()!=\'\'">
    <dt>Related Collection Name</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:relatedItem/mods:identifier">
    <xsl:if test="current()!=\'\'">
    <dt>Related Collection ID</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:language/mods:languageTerm[@type=\'text\']">
    <xsl:if test="current()!=\'\'">
    <dt>Language</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//mods:language/mods:scriptTerm[@type=\'text\']">
    <xsl:if test="current()!=\'\'">
    <dt>Script</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:nameEntry[@localType=\'primary\']/cpf:part">
    <xsl:if test="current()!=\'\'">
    <dt>Project Name (Full)</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:nameEntry[@localType=\'abbreviation\']/cpf:part">
    <xsl:if test="current()!=\'\'">
    <dt>Project Name (Abbreviation)</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:function/cpf:descriptiveNote/cpf:p">
    <xsl:if test="current()!=\'\'">
    <dt>Project Data Access and Use Constraints</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:existDates/cpf:dateRange/cpf:fromDate">
    <xsl:if test="current()!=\'\'">
    <dt>Begin Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:existDates/cpf:dateRange/cpf:toDate">
    <xsl:if test="current()!=\'\'">
    <dt>End Date</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:place/cpf:placeEntry[@localType=\'address\']">
    <xsl:if test="current()!=\'\'">
    <dt>Project Location</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>
    <xsl:for-each select="//cpf:place/cpf:placeEntry[@localType=\'region\']">
    <xsl:if test="current()!=\'\'">
    <dt>Region</dt><dd><xsl:value-of select="current()"/></dd>
        </xsl:if>
    </xsl:for-each>








  </dl>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>
';
}

/*
 * Moves a file from the XSL directory to the backup directory while renaming based on time.
 * This is to remove it from the dropdown list when doing SIdora configuration
 */
function sidora_remove_xsl($param1) {
  $curr_item = array();
  if (sidora_endsWith(strtolower($param1),'.xsl')) {
    $exists = db_query('SELECT 1 FROM {sidora_xsl} WHERE form_name = :form_name', array(':form_name' => $param1))->fetchField();
    if ($exists) {
       $rename_worked = db_delete('sidora_xsl')
          ->condition('form_name', $param1)
          ->execute();
       $curr_item['existing_moved'] = $rename_worked;
       $curr_item['description'] = t('Attempted file write');
       $curr_item['success'] = $rename_worked;
    }
    else {
      $curr_item['success'] = FALSE;
      $curr_item['description'] = t('XSL File not found');
    }
  }
  else {
   $curr_item['success'] = FALSE;
   $curr_item['description'] = t('Wrong file extension for xsl delete');
  }
  $return_when_encoded['files'][] = $curr_item;
  print json_encode($return_when_encoded);
  drupal_exit();
}

function sidora_get_xsl_exhibition_config_for_object($pid) {
  $exhibition_config_xsl_file = '';
  if ((isset($pid)) && (!empty($pid))) {
    $exhibition_data = exhibition_config_get_config_data($pid);
    if (!(empty($exhibition_data)) && !(is_null($exhibition_data['pid'])) && !(is_null($exhibition_data['last_published'])) && ($exhibition_data['last_published'] != '')){
      $exhibition_config_publish_settings = unserialize($exhibition_data['last_published']);
      $exhibition_config_xsl_file =  $exhibition_config_publish_settings['xslt'];
     }
   }
   return $exhibition_config_xsl_file;
}
function sidora_update_xsl() {
  if (!db_table_exists('sidora_xsl')) {
    $schema['sidora_xsl'] = array(
     'description' => t('Stores SIdora XSLs'),
     'fields' => array(
       'form_id' => array(
         'type' => 'serial',
         'unsigned' => TRUE,
         'not null' => TRUE,
       ), 
       'form_name' => array(
         'type' => 'varchar',
         'length' => '256',
         'not null' => TRUE,
         'default' => '',
       ),
       'form_definition' => array(
	 'type' => 'text',
	 'size' => 'big',
       ),
       'updated' => array(
         'type' => 'datetime',
         'mysql_type' => 'datetime',
       ),
     ),
     'primary key' => array('form_id'),
   );
   db_create_table('sidora_xsl', $schema['sidora_xsl']);
   }
  $directory_to_list_for_xsl = DRUPAL_ROOT.'/'.drupal_get_path('module','sidora').'/XSL';
  $xsl_filenames = array_diff(scandir($directory_to_list_for_xsl), array('..', '.', '.htaccess'));
  $xsl_names_dd = array();
  foreach($xsl_filenames as $name){ 
    if (sidora_endsWith(strtolower($name), ".xsl")){
      $xsl_names_dd[$name] = $name; 
    }
  }
  foreach($xsl_names_dd as $xsl_to_write) {
    sidora_xsl_file_to_db($directory_to_list_for_xsl,$xsl_to_write);
  }
  drupal_set_message("All SIdora XSL's sucessfully added to the database");
  drupal_goto('admin/sidora/configure');
}	  
function sidora_download_xsl() {
  global $base_url;
  if (db_table_exists('sidora_xsl')) {
    $get_xsl_records = db_query("select form_name, form_definition from sidora_xsl");
    $xsl_zip = new ZipArchive();
    $download_filename = 'sidora_xsl_from_';
    $alpha_base_url = preg_replace('/[^a-zA-z0-9]/', '-', $base_url);
    $alpha_base_url = preg_replace('/-+/', '-', $alpha_base_url);
    $download_filename .= $alpha_base_url . '.zip';
    if ($xsl_zip->open(drupal_realpath('public://').'/'.$download_filename, ZipArchive::CREATE | ZipArchive::OVERWRITE)) { 
      foreach ($get_xsl_records as $xsl_form_record) {
        $definition = new DOMDocument();
        $definition->loadXML($xsl_form_record->form_definition);
	$definition->formatOutput = TRUE;
	$xsl_zip->addFromString($xsl_form_record->form_name, $definition->saveXML());
      }
      $xsl_zip->close();
      header("Content-type: application/zip"); 
      header("Content-Disposition: attachment; filename=$download_filename");
      header('Content-Length: '.filesize(drupal_realpath('public://').'/'.$download_filename)); 
      header("Pragma: no-cache"); 
      header("Expires: 0"); 
      readfile(drupal_realpath('public://').'/'.$download_filename);
      unlink(drupal_realpath('public://').'/'.$download_filename);		
    }
    else {
      drupal_set_message("Unable to create a zip file");
    }
  }
  else {
    drupal_set_message("No sidora xsl's found in the database");
  }
  drupal_exit();
}			
function sidora_xsl_file_to_db($directory_to_list_for_xsl = '',$xsl_to_write = '') {
  if ((!empty($directory_to_list_for_xsl)) && (!empty($xsl_to_write))) {
   $definition = new DOMDocument();
   $definition->load($directory_to_list_for_xsl . '/' . $xsl_to_write);
   $exists = db_query('SELECT 1 FROM {sidora_xsl} WHERE form_name = :form_name', array(':form_name' => $xsl_to_write))->fetchField();
   if ($exists) {
     $xsl_query = db_update('sidora_xsl')
      ->fields(array(
       'form_definition' => $definition->saveXML(),
       'updated' => date('Y-m-d H:i:s'),
      ))
      ->condition('form_name', $xsl_to_write, '=');
     $num_updated = $xsl_query->execute();
     $new_entry = NULL;
   }
   else {
     $insert_query = db_insert('sidora_xsl')->fields(array('form_name','form_definition','updated'));
     $insert_row = array(
       'form_name' => $xsl_to_write,
       'form_definition' => $definition->saveXML(),
       'updated' => date('Y-m-d H:i:s'),
      );	
      $insert_query->values($insert_row);	
      $new_entry = $insert_query->execute();
   }
    return TRUE;
  }
  return FALSE;
}
function sidora_get_all_xsl_names() {
  $xsl_filenames = array();
  if (db_table_exists('sidora_xsl')) {
    $get_xsl_records = db_query("select form_name from sidora_xsl");
    foreach ($get_xsl_records as $xsl_form_record) {
      if (sidora_endsWith(strtolower($xsl_form_record->form_name), ".xsl")) {
        $xsl_filenames[$xsl_form_record->form_name] = $xsl_form_record->form_name;
      }
    }
  }
  return $xsl_filenames;
}
