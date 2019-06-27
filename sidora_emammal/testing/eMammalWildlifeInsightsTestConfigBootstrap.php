<?php

/*
 Tried setting using a XML config file but must've missed how to use it. Tried running via:
./phpunit --configuration eMammalWildlifeInsightsTestConfig.xml eMammalWildlifeInsightsTest.php
with this as the XML content:
<php>
  <includePath>.</includePath>
  <const name="DRUPAL_ROOT" value="/home/randerson/projects/sidora/sidora0.6test"/>
  <const name="TUQUE_LIBRARY_ROOT" value="/home/randerson/projects/sidora/sidora0.6test/sites/all/libraries/tuque"/>
  <server name="REMOTE_ADDR" value="127.0.0.1"/>
</php>
*/

define("DRUPAL_ROOT", "/home/jwoyciechowsky/projects/sidora");
define("TUQUE_LIBRARY_ROOT", "/home/jwoyciechowsky/projects/sidora/sites/all/libraries/tuque");
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
