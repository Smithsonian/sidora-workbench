<?php // print $messages; ?>
<style type="text/css" media="all">
#branding {
  display: none;
}

#logo_container {
  margin: 0 auto;
  width: 420px;
  text-align: center;
  font-family: "Georgia", "Times New Roman", Serif;
}

#logo_container h1 {
  font-size: 2.3em;
  font-weight: normal;
  margin-bottom: 20px;
}

#page {
  margin: 10% auto 0 auto;
  width: 420px;
}

.form-item {
  text-align: center;
}
.form-item label {
  float: left;
}	
input.form-text {
  width: 96%;
  height: 1.6rem;
  font-size: 1rem;
  padding: 6px;
}
</style>
<div id="logo_container">
  <!--
	<img src="<?php echo base_path() . drupal_get_path('module', 'sidora'); ?>/images/logo.png" alt="Smithsonian logo">
	-->
  <h1>Contact SIdora Administrators</h1>
</div>
<?php 
print drupal_render_children($form); 
?>