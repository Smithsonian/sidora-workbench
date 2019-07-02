<?php


require_once DRUPAL_ROOT . '/includes/bootstrap.inc';

// Bootstrap Drupal.
drupal_bootstrap(DRUPAL_BOOTSTRAP_FULL);
require_once TUQUE_LIBRARY_ROOT . "/HttpConnection.php";
require_once TUQUE_LIBRARY_ROOT . "/Repository.php";
require_once TUQUE_LIBRARY_ROOT . "/RepositoryConnection.php";
foreach (glob(TUQUE_LIBRARY_ROOT . "/*.php") as $filename)
{
    $bn = basename($filename, ".php");
    if (class_exists($bn)){
      //echo $bn . " exists.\n";
    }
    else {
      //echo $filename . " is loading.\n";
      require_once $filename;
    }
}
/*
*/
module_load_include('inc', 'islandora', 'includes/tuque');
module_load_include('inc', 'islandora', 'includes/tuque_wrapper');

// Proceed with PHPUnit tests as usual from here.
class eMammalWildlifeInsightsTest extends \PHPUnit_Framework_TestCase {
  public function getTestData(){
    $testInfo = array(
      'testCanProjectBeCreated' => array(
        'fedora_project_id' => 'ct:1697264',
      ),
      'testCanProjectBeUpdated' => array(
        'fedora_project_id' => 'ct:1697264',
      ),
      'testCanFullProjectTreeBeCreated' => array(
        'fedora_project_id' => 'ct:1697264',
      ),
      'testCanSequenceBeCreated' => array(
        'fedora_deployment_id' => 'ct:1689234',
      ),
      'testCanDeploymentBeCreated' => array(
        'fedora_deployment_id' => 'ct:1689234',
      ),
      'testCanDeploymentBeUpdated' => array(
        'fedora_deployment_id' => 'ct:1689234',
      ),
      'testCanDataFileBeCreated' => array(
        'wi_project_id' => '100',
        'wi_deployment_id' => '221',
        'wi_sequence_id' => '1519',
      ),
    );
    return $testInfo;
  }
  public function testCanDataFileBeCreated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $wi_proj_id = $testData['wi_project_id'];
    $wi_depl_id = $testData['wi_deployment_id'];
    $wi_seq_id = $testData['wi_sequence_id'];
    $result = sidora_emammal_wi_curl_data_file('https://staging.api.wildlifeinsights.org/api/v1/project/39/deployment/179/data-file');
    echo $result;
    
  }
  public function testCanGetIdentificationMethods(){
    $result = sidora_emammal_wi_api_call("identification-methods/1");
    echo $result;
  } 
  public function testCanDeploymentBeCreated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_deployment_id'];
    $obj = sidora_obj($obj_id);
    $original_label = $obj->label;
    $obj->label = substr($original_label,0,20) . "-test1-" . date("Ymd_His");
    $wi_id = sidora_emammal_wi_create_deployment($obj, TRUE);
    $obj->label = $original_label;
    $this->assertTrue(!empty($wi_id));
  }
  public function testCanSequenceBeCreated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_deployment_id'];
    $obj = sidora_obj($obj_id);
    $original_label = $obj->label;
    $obj->label = substr($original_label,0,20) . "-test1-" . date("Ymd_His");
    $wi_id = sidora_emammal_wi_create_sequence($obj, 'testCanSequenceBeCreated', TRUE);
    $obj->label = $original_label;
    $this->assertTrue(!empty($wi_id));
  }
  public function testCanTokenBeCreated() {
    $token = sidora_emammal_get_wi_token();
    $this->assertTrue(is_string($token));
    $this->assertTrue(sizeof($token) > 0);
  }
  public function testCanGetOrganizationInformation(){
    $all_orgs = sidora_emammal_wi_get_all_organizations();
    $this->assertTrue(!empty($all_orgs));
    $this->assertTrue(is_string($all_orgs));
    $json = json_decode($all_orgs);
    $this->assertTrue(!empty($json));
  }
  public function testCanOrganizationBeCreated(){
    /**
    * This is really only for the original creation or if we delete it,
    * but that is unlikely
    **/
    /*
    $created_org_id = sidora_emammal_wi_create_organization();
    $this->assertTrue(is_string($created_org_id));
    */
  }
  public function testCanOrganizationBeObtained(){
    $org_id = sidora_emammal_wi_get_organization_id();
    $this->assertTrue(is_string($org_id) || is_numeric($org_id));
  }
  public function testCanProjectBeCreated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_project_id'];
    $obj = sidora_obj($obj_id);
    $original_label = $obj->label;
    $obj->label = substr($original_label,0,20) . "-test1-" . date("Ymd_His");
    $wi_id = sidora_emammal_wi_create_project($obj, TRUE);
    $obj->label = $original_label;
    $this->assertTrue(!empty($wi_id));
  }
  public function testCanFullProjectTreeBeCreated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_project_id'];
    $obj = sidora_obj($obj_id);
    $original_label = $obj->label;
    $obj->label = substr($original_label,0,20) . "-test2-" . date("Ymd_His");
    $wi_id = sidora_emammal_wi_create($obj, 'project', '', TRUE);
    $obj->label = $original_label;
    $this->assertTrue(!empty($wi_id));
  }
  public function testCanDeploymentBeUpdated(){
    
   $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_deployment_id'];
    $obj = sidora_obj($obj_id);
    $updated_deployment = '<metadata xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:fgdc="http://localhost" xsi:noNamespaceSchemaLocation="C:/Users/liuf/Documents/Sidora/CAMERA~1/AMAZON~1/fgdc-std-001-dot-1-1999/fgdc-std-001.1-1999.xsd">
<idinfo>
<citation>
<citeinfo>
<origin>2812</origin>
<pubdate>Unpublished material</pubdate>
<title>MKC 0.5 testing 2</title>
<geoform>remote sensing image</geoform>
<othercit>d18262</othercit>
</citeinfo>
</citation>
<descript>
<abstract>Game trail. 2388m.</abstract>
<purpose>See Project Objectives</purpose>
</descript>
<timeperd>
<timeinfo>
<rngdates>
<begdate>20150918</begdate>
<enddate>20151016</enddate>
</rngdates>
</timeinfo>
<current>observed</current>
</timeperd>
<status>
<progress>In work</progress>
<update>As needed</update>
</status>
<keywords>
<theme>
<themekt>None</themekt>
<themekey>Camera Trap</themekey>
</theme>
<place>
<placekt>None</placekt>
<placekey/>
</place>
</keywords>
<taxonomy>
<keywtax>
<taxonkt>None</taxonkt>
<taxonkey>multiple species</taxonkey>
</keywtax>
<taxoncl>
<taxonrn>Kingdom</taxonrn>
<taxonrv>Animal</taxonrv>
<common>Animal</common>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>Camera Trapper</taxonrv>
<common>Camera Trapper</common>
</taxoncl>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>Nesotragus moschatus</taxonrv>
<common>Suni</common>
</taxoncl>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>Syncerus caffer</taxonrv>
<common>African Buffalo</common>
</taxoncl>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>No Animal</taxonrv>
<common>No Animal</common>
</taxoncl>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>Unknown Animal</taxonrv>
<common>Unknown Animal</common>
</taxoncl>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>Potamochoerus larvatus</taxonrv>
<common>Bushpig</common>
</taxoncl>
<taxoncl>
<taxonrn>Species</taxonrn>
<taxonrv>Tragelaphus scriptus</taxonrv>
<common>Bushbuck</common>
</taxoncl>
</taxoncl>
</taxonomy>
<accconst>US</accconst>
<useconst>None</useconst>
<spdom>
<descgeog/>
<bounding>
<westbc/>
<eastbc/>
<northbc/>
<southbc/>
</bounding>
</spdom>
<datacred/>
</idinfo>
<dataqual>
<logic>None</logic>
<complete>Camera Functioning</complete>
<lineage>
<method>
<methtype>Bait</methtype>
<methodid>
<methkt>None</methkt>
<methkey>No bait</methkey>
</methodid>
<methdesc/>
</method>
<method>
<methtype>Feature</methtype>
<methodid>
<methkt>None</methkt>
<methkey>Not Entered</methkey>
</methodid>
<methdesc/>
</method>
<procstep>
<procdesc>Proposed Camera Deployment Begin Date</procdesc>
<procdate/>
</procstep>
<procstep>
<procdesc>Proposed Camera Deployment End Date</procdesc>
<procdate/>
</procstep>
</lineage>
</dataqual>
<spref>
<vertdef>
<altsys>
<altdatum>North American Vertical Datum of 1988</altdatum>
<altunits>feet</altunits>
<altenc>
Explicit elevation coordinate included with horizontal coordinates
</altenc>
<altres/>
</altsys>
</vertdef>
<horizsys>
<geograph>
<latres/>
<longres/>
<geogunit>Decimal degrees</geogunit>
</geograph>
</horizsys>
</spref>
<eainfo>
<detailed>
<enttyp>
<enttypl>Camera Settings</enttypl>
<enttypd>Camera Settings for the Deployment.</enttypd>
<enttypds>Camera Trap Data Federation</enttypds>
</enttyp>
<attr>
<attrlabl>Camera ID</attrlabl>
<attrdef>The Unique identifier for the camera.</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>MP 16</edomv>
<edomvd>The Unique identifier for the camera.</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Image Resolution Setting</attrlabl>
<attrdef>Image Resolution Setting</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>3.1</edomv>
<edomvd>Image Resolution Setting</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Detection Distance</attrlabl>
<attrdef>
Maximum distance at which a camera triggered, as tested during deployment, measured in meters
</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>7</edomv>
<edomvd>
Maximum distance at which a camera triggered, as tested during deployment, measured in meters
</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Sensitivity Setting</attrlabl>
<attrdef>Sensitivity setting for motion sensor</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>Medium</edomv>
<edomvd>Sensitivity setting for motion sensor</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Quiet Period Setting</attrlabl>
<attrdef>
Time set as minimum break between triggers of the camera, measured in seconds
</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>0</edomv>
<edomvd>
Time set as minimum break between triggers of the camera, measured in seconds
</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Actual Latitude</attrlabl>
<attrdef>The actual latitude of the camera</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>-0.10632</edomv>
<edomvd>The actual latitude of the camera</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Actual Longitude</attrlabl>
<attrdef>The actual longitude of the camera</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>37.14497</edomv>
<edomvd>The actual longitude of the camera</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Proposed Latitude</attrlabl>
<attrdef>The proposed latitude of the camera</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>NaN</edomv>
<edomvd>The proposed latitude of the camera</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Proposed Longitude</attrlabl>
<attrdef>The proposed longitude of the camera</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv>NaN</edomv>
<edomvd>The proposed longitude of the camera</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Camera Height</attrlabl>
<attrdef>The height of the camera.</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv/>
<edomvd>The height of the Camera.</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
<attr>
<attrlabl>Habitat Type</attrlabl>
<attrdef>The type of habitat where the camera is located.</attrdef>
<attrdefs>Camera Trap Data Federation</attrdefs>
<attrdomv>
<edom>
<edomv/>
<edomvd>The type of habitat where the camera is located.</edomvd>
<edomvds>Camera Trap Data Federation Standard</edomvds>
</edom>
</attrdomv>
</attr>
</detailed>
</eainfo>
<metainfo>
<metstdn>
FGDC Biological Data Profile of the Content Standard for Digital Geospatial Metadata
</metstdn>
<metstdv>1999</metstdv>
<metd/>
<metrd/>
<metfrd/>
<metc>
<cntinfo>
<cntperp>
<cntper/>
<cntorg/>
</cntperp>
<cntaddr>
<addrtype>Mailing</addrtype>
<address/>
<city/>
<state/>
<postal/>
</cntaddr>
<cntvoice/>
<cntemail/>
</cntinfo>
</metc>
</metainfo>
</metadata>';
    $wi_id = sidora_emammal_wi_get_id($obj);
    $obj['FGDC']->setContentFromString($updated_deployment);
    $wi_update_succeeded = sidora_emammal_wi_update($obj, 'deployment');
    $this->assertTrue(!empty($wi_id));
    $result = sidora_emammal_wi_api_call("/api/v1/project/$wi_id/deployment/d18262");
    var_dump($result);
  }
  public function testCanProjectBeUpdated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_project_id'];
    $obj = sidora_obj($obj_id);
    $wi_id = sidora_emammal_wi_get_id($obj);
    $original_label = $obj->label;
    $new_label = substr($original_label,0,10) . "-update1-" . date("Ymd_His");
    $obj->label = $new_label;
    $wi_update_succeeded = sidora_emammal_wi_update($obj, 'project');
    $obj->label = $original_label;
    $this->assertTrue(!empty($wi_id));
    $this->assertTrue($wi_update_succeeded);
    $org_id = sidora_emammal_wi_get_organization_id();
    $result = sidora_emammal_wi_api_call("organization/$org_id/project/$wi_id");
    $new_label_loc = strpos($result, $new_label);
    $this->assertTrue($new_label_loc > 0);
  }
  public function testCanDatafileBeUpdated(){
    //$dataFile_update = '';

  }
}
