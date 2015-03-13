<?php
/**
 * @file
 *
 * Template file for si_exhibition object displays
 *
 * Variables available:
 * - $navigation:
 * - $title:
 * - $metada:
 * - $resources:
 */
?>
<div id="si-exhibition" class="<?php print $layout; ?>">
   <?php if ($block_exposed == 'no'): ?>
     <?php print theme('si_exhibition_navigation', $object); ?>
   <?php endif; ?>
   <div id="si-content">
     <h2 class="object-title"><?php print theme('si_exhibition_page_title', $object); ?></h2>
     <span class="si-icon <?php print $model_classes; ?>"></span>
     <div id="si-content-inner">
      <?php print theme('si_exhibition_metadata', $object); ?>
     </div>
   </div>
   <div id="si-resources">
    <h2><?php print t('Resources'); ?></h2>
    <div id="si-resources-inner">
      <?php print theme('si_exhibition_resources', $object); ?>
    </div>
  </div>
</div>
