<?php

function sidora_view_openseadragon($pid, $dsid, $version='0'){
  $osd_js_path = variable_get('osd_library_location', $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/jslibs/openseadragon-djatoka/');
  $local_resolver = variable_get('osd_local_resolver_service', $GLOBALS['base_url'].'/'.'sidora/osd/');
  $jquery = variable_get('osd_jquery_library_location', $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/jslibs/openseadragon-djatoka/jquery/jquery-2.1.4.min.js');
  print "\r\n".'<html>                                                                                                      ';
  print "\r\n".'  <head>                                                                                                    ';
  print "\r\n".'    <script src="'.$jquery.'"></script>';
  print "\r\n".'    <script src="'.$osd_js_path.'openseadragon/openseadragon.min.js"></script>';
  print "\r\n".'    <script src="'.$osd_js_path.'js/djtilesource.js"></script>';
  print "\r\n".'  </head>                                                                                                   ';
  print "\r\n".'  <body>                                                                                                    ';
  print "\r\n".'    <div id="container">                                                                                    ';
  print "\r\n".'      <div id="page-image" style="width: 100%; height: 100%;">                                            ';
  print "\r\n".'        <script>                                                                                            ';
  print "\r\n".'          <!-- create the tile source -->                                                                   ';
//  print "\r\n".'          var service = "/adore-djatoka/resolver";';
  print "\r\n".'          var service = "'.$local_resolver.$pid.'/'.$dsid.'/'.$version.'";';
  print "\r\n".'          var id = "{replacer}";';  //replacer is a value that is hard-coded to be replaced with the proper id in the osd_proxy function
  print "\r\n".'          var settings = {tileSize: 256, tileOverlap: 0};                                                   ';
  print "\r\n".'          var tileSource = new OpenSeadragon.DjatokaTileSource(service, id, settings);                      ';
  print "\r\n".'          <!-- create the OpenSeadragon Viewer with the TileSource -->                                      ';
  print "\r\n".'          OpenSeadragon({                                                                                   ';
  print "\r\n".'            id: "page-image",                                                                               ';
  print "\r\n".'            prefixUrl: "'.$osd_js_path.'openseadragon/images/",';
  print "\r\n".'            showNavigator: true,                                                                            ';
  print "\r\n".'            debugMode: false,                                                                                ';
  print "\r\n".'            tileSources: [tileSource],                                                                      ';
  print "\r\n".'            showRotationControl: true                                                                       ';
  print "\r\n".'          });                                                                                               ';
  print "\r\n".'        </script>                                                                                           ';
  print "\r\n".'      </div>                                                                                                ';
  print "\r\n".'    </div>                                                                                                  ';
  print "\r\n".'  </body>                                                                                                   ';
  print "\r\n".'</html>                                                                                                     ';
  drupal_exit();
}
/*
 * Returns the full view for the phpexcelreader plus javascript
 */
function sidora_tabular_view_phpexcelreader($pid,$dsid = 'OBJ'){
  module_load_include('inc', 'sidora', 'includes/utils');
  $object = sidora_obj($pid);
  $datastream_content = $object[$dsid]->content;
  $datastream = $object[$dsid];
  $mime_type = (empty($datastream))?'text/xml':$datastream->mimeType;
  $file_extension = '';
  if ($mime_type != ''){
    $file_extension = sidora_get_file_extension_from_mime($mime_type);
  } 
  $filename = $pid.'_'.$dsid.$file_extension;//get_suggest_filename($label, $mime_type);
  $file_uri = drupal_tempnam(file_directory_temp(), $filename);
  $file = new stdClass();
  $file->uri = $file_uri;
  $file->filename = $filename;
  $file->filemime = $mime_type;
  $file->status = 0; // Temporary file.
  file_unmanaged_save_data($datastream_content, file_directory_temp() . '/'.$filename, FILE_EXISTS_REPLACE); 
  $temp = file_directory_temp();
  $rels = $object->relationships->get(FEDORA_RELS_EXT_URI, 'hasCodebook');
  global $base_url;
  $data_tables_lib_location = variable_get('sidora_dataTables_location',$base_url.'/'.drupal_get_path('module','sidora').'/jslibs/dataTables/');
  echo '<html>
<head>
  <link rel="stylesheet" href="'.$data_tables_lib_location.'css/jquery.dataTables.css"></link>
  <script src="'.$data_tables_lib_location.'js/jquery.js"></script>
  <script src="'.$data_tables_lib_location.'js/jquery.dataTables.min.js"></script>
  <style>
     #hasHeader { display:none }
     #noHeader { display:none }
     #hasHeader_wrapper { display:none }
     #noHeader_wrapper { display:none }
  </style>
  <script>
    jQuery(document).ready(function(){
      jQuery("table").DataTable({
        "lengthMenu": [ [-1,5,10,25,100],["All",5,10,25,100] ],
        "order": []
      });
      jQuery("table").show();
      jQuery("#noHeader_wrapper").show();
      jQuery("#showHeaderTable").click(function(){
        jQuery("#noHeader_wrapper").toggle();
        jQuery("#hasHeader_wrapper").toggle();
      });
    });
  </script>
';
  $use_codebook_headers = '';
  if (!empty($rels)){
    $codebook_pid = ($rels[0]['object']['value']);
    $codebook_obj = sidora_obj($codebook_pid);
    if (!empty($codebook_obj['DDI'])){
      $doc = new DOMDocument();
      $content = $codebook_obj['DDI']->content;
      $doc->loadXML($content);
      $label_elements = $doc->getElementsByTagName('label');
      $labels = array(); 
      foreach($label_elements as $element){
        $labels[] = $element->nodeValue;
      }
      $use_codebook_headers = '<br/><input type="checkbox" id="useCodebookHeaders" />Use Codebook Headers';
      echo '
  <script>
    jQuery(document).ready(function(){
      window.tablesInfo = {};
      tablesInfo.originalHasHeader = [];
      tablesInfo.codebookLabels = [';
      foreach($labels as $i => $label){
        if ($i > 0) echo ',';
        echo '"'.$label.'"';
      }
      echo '
      ];
      jQuery("#hasHeader th").each(function(index,value){
        tablesInfo.originalHasHeader.push(jQuery(value).text());
      });
      jQuery("#useCodebookHeaders").click(function(){
        if (jQuery("#useCodebookHeaders").prop("checked")){
          jQuery("#noHeader th").each(function(index,value){
            if (tablesInfo.codebookLabels.length > index){
              value.innerHTML = tablesInfo.codebookLabels[index];
            }else{
              value.innerHTML = "";
            }
          });
          jQuery("#hasHeader th").each(function(index,value){
            if (tablesInfo.codebookLabels.length > index){
              value.innerHTML = tablesInfo.codebookLabels[index];
            }else{
              value.innerHTML = "";
            }
          });
        }else{
          jQuery("#noHeader th").each(function(index,value){
            value.innerHTML = "";
          });
          jQuery("#hasHeader th").each(function(index,value){
            if (tablesInfo.originalHasHeader.length > index){
              value.innerHTML = tablesInfo.originalHasHeader[index];
            }else{
              value.innerHTML = "";
            }
          });
        } 
      });
    });
  </script>
';
    }
  }
  echo '
</head>
<body>
';
  echo '<input type="checkbox" id="showHeaderTable" />Has Header Row';
  echo $use_codebook_headers;
  echo sidora_tabular_view_phpexcelreader_html($temp.'/'.$filename, TRUE, 'hasHeader');
  echo sidora_tabular_view_phpexcelreader_html($temp.'/'.$filename, FALSE, 'noHeader');
  echo '</body>
</html>';
  drupal_exit();
}
/*
 * Returns the cell value properly formatted as a string
 * This will allow use to control the date format if needed
 */
function sidora_tabular_view_phpexcelreader_html_string($objPHPExcel, $cell) {
  if(PHPExcel_Shared_Date::isDateTime($cell)) {
    $code = $objPHPExcel->getActiveSheet()->getStyle($cell->getCoordinate())->getNumberFormat()->getFormatCode();
    if ($code == 'mm-dd-yy'){
       //So, getting into this a bit here's the problem
       //Excel saves "general" dates as format mm-dd-yy
       //but it shows them in program as MM/DD/YYYY
       //AND it also stores text with the standard mm-dd-yy format
       //PHPExcel still considers this text to return true from isDateTime, but knows when
       //it is formatting not to try to use it as a date.
       $our_output_format = 'n/j/Y';
       $their_output_format = 'm-d-y';
       //The cell value coming back as a date is 00:00:00 and then when
       //formatting happens will take it to the previous day
       //so bump up a day when we are dealing with pure date and no time
       $date_number = PHPExcel_Shared_Date::ExcelToPHP($cell->getValue()+1);
       $their_output = date($their_output_format, $date_number);
       $our_output = date($our_output_format, $date_number);
       $their_formatted = $cell->getFormattedValue();
       $to_return = $their_formatted;
       if ($their_formatted == $their_output) {
         $to_return = $our_output;
       }
       return $to_return;

    }
    return $cell->getFormattedValue();
  }
  return $cell->getFormattedValue();
}
/*
 * Returns the pure HTML table based on the given filename
 */
function sidora_tabular_view_phpexcelreader_html($filename, $first_line_header = TRUE, $table_id = ''){
  require_once(libraries_get_path('PHPExcel') . '/Classes/PHPExcel/IOFactory.php');
  $objReader = PHPExcel_IOFactory::createReaderForFile($filename);
  $objPHPExcel = $objReader->load($filename);
  $worksheet = $objPHPExcel->getActiveSheet();
  $table_header = '<thead><tr>';
  $table_data = '<tbody>';
  $is_first = TRUE;
  $count = 0;
  foreach ($worksheet->getRowIterator() as $row) {
  	if (!$is_first || !$first_line_header){
      $table_data .= '<tr>';
    }
    $cellIterator = $row->getCellIterator();
  	$cellIterator->setIterateOnlyExistingCells(false); // Loop all cells, even if it is not set
    foreach ($cellIterator as $cell) {
      if ($is_first){
        if ($first_line_header){
          $table_header .= '<th>' . sidora_tabular_view_phpexcelreader_html_string($objPHPExcel, $cell) . '</th>';
        }else{
          $table_header .= '<th></th>'; 
        }
      }
      if (!is_null($cell) && !($is_first && $first_line_header)) {
        $table_data .= '<td>' . sidora_tabular_view_phpexcelreader_html_string($objPHPExcel, $cell) . '</td>';
      }
    }
  	if (!$is_first || !$first_line_header){
		  $table_data .= '</tr>';
    }
    $is_first = FALSE;
  }
  $table_header .= '</tr></thead>';
  $table_data .= '</tbody>';

  $to_return = '<table class="display" id="'.$table_id.'">';
  $to_return .= $table_header;
  $to_return .= $table_data;
  $to_return .= '</table>';
  return $to_return;
}

/**
 * IDS Iframe contents, direct to output, exit() at end
 *
 * @param string $pid
 * @param string $dsid
 *
 * @return none
 */
function sidora_view_ids_iframe($pid, $dsid) {
  print '<html>';
  print '<head>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/jquery-1.9.1.min.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/jquery-ui-1.9.2.custom.min.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/jquery.dynatree.min.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/scrollspy.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/jquery.jscroll.min.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/imagesloaded.pkgd.min.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/masonry.pkgd.min.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/jquery.ids.js"';
  print '></script>';
  print '<script src="';
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/seadragon-min.js"';
  print '></script>';
/*
*/
  print '</head>';
  print '<body>';
  print "
<script>
$(function(){
var ids_id = '";
  print str_replace('https','http',$GLOBALS['base_url']);
  print "/sidora/info/$pid/meta/$dsid/browser';

var ids__ = jQuery('#containerIDS').ids({
      idsid: ids_id,
      idsButtonPath: '";
  print $GLOBALS['base_url'].'/'.drupal_get_path('module','sidora').'/idsiframe/js/buttons/';
  print "',
      //container: 'containerIDS',
      rotation: 0,
      fullscreen: false,
      onComplete: function() {
        jQuery('span[title=\"Toggle full page\"]').remove(); //Doesn't make sense to have a fullscreen button on this
      },
    });
});
</script>
<div id='containerIDS' height='100%' width='100%'></div>

";
  print '</body>';
  print '</html>';
  drupal_exit();
}

