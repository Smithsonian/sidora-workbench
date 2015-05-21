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
  /*
  margin: 10% auto 0 auto;
  Added next 2 lines  */
  margin: 0 auto;
  padding: 20 0 0 0;
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
  <img src="/~ghalusa/sidora/sidora0.4/<?php echo drupal_get_path('module', 'sidora'); ?>/images/logo.png" alt="Smithsonian logo">
  <h1>SIdora Workbench</h1><!-- SIdora team officially has the SI capitalized for anything reaching user, even though they often dont on internal information-->
</div>
<?php
 /* split the username and password from the submit button 
   so we can put in links above */
    print drupal_render($form['name']);
    print drupal_render($form['pass']);
    print drupal_render($form['form_build_id']);
    print drupal_render($form['form_id']);
    print variable_get('sidora_login_message', '');
    print drupal_render($form['actions']);
?>
<p>Not a member? <a href="mailto:pday@quotient-inc.com?Subject=Request SIdora Account&amp;body=My name is:-Enter Name- 
  and my Email is:-Enter Email- and I would like to request a new SIdora Account"> Submit an Account Request</a><p>
<p>Need help? <a href="javascript:void(0);">Contact Us</a> <span style="color: #999;">(link to contact form)</span></p>
<!-- <p><a href="user/password">Request a New Password</a></p> -->
