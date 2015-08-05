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

input.form-text {
  width: 96%;
  height: 1.6rem;
  font-size: 1rem;
  padding: 6px;
}
</style>
<div id="logo_container">
  <img src="<?php echo base_path() . drupal_get_path('module', 'sidora'); ?>/images/logo.png" alt="Smithsonian logo">
  <h1>Sidora Workbench</h1>
</div>
<?php 
$form['name']['#value'] = '';
print drupal_render_children($form); 
?>
<p>SIdora is currently limited only to selected projects but access will be
gradually expanded. If you are working on one of the projects please
fill out this form to request an account. Smithsonian account holders
must provide their SI usernames. Other users should provide a preferred
username and valid email address. You will be contacted by email with an
account invitation as soon as we have processed your request. If you do
not receive it shortly please check your spam filter. Feel free to
contact us again if you have not received a timely response. Passwords
should never be sent in any request and we will never ask for them. For
SI account holders your SIdora account is linked to your SI account.
Other users will be provided account instructions with your invitation.<p>