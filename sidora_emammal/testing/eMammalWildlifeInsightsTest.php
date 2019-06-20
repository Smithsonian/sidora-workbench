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
      'testCanFullProjectTreeBeCreated' => array(
        'fedora_project_id' => 'ct:1697264',
      ),
      'testCanSequenceBeCreated' => array(
        'fedora_deployment_id' => 'ct:1689234',
      ),
      'testCanDeploymentBeCreated' => array(
        'fedora_deployment_id' => 'ct:1689234',
      ),
    );
    return $testInfo;
  }
  
  public function testCanDeploymentBeCreated(){
    $testInfo = $this->getTestData();
    $testData = $testInfo[__FUNCTION__];
    $obj_id = $testData['fedora_deployment_id'];
    $obj = sidora_obj($obj_id);
    $original_label = $obj->label;
    $obj->label = substr($original_label,0,25) . "-test1-" . date("Ymd_His");
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
    $obj->label = substr($original_label,0,25) . "-test1-" . date("Ymd_His");
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
    $obj->label = substr($original_label,0,25) . "-test1-" . date("Ymd_His");
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
    $obj->label = substr($original_label,0,25) . "-test2-" . date("Ymd_His");
    $wi_id = sidora_emammal_wi_create($obj, 'project', '', TRUE);
    $obj->label = $original_label;
    $this->assertTrue(!empty($wi_id));
  }
}
