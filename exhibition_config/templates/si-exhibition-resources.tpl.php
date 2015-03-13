<div class="controls">
   <?php print theme('item_list', $limit_types, t('Limit by type'), 'ul', array('class' => 'limit-by-type')) ?>
</div>
<div class="controls">
   <?php print  theme('item_list', $results_per_page, t('Results per page'), 'ul', array('class' => 'results-per-page')); ?>
</div>
<div class="showing">
   <?php print t('Showing') . ' ' . ($offset + 1) . ' - ' . min($offset + $limit, $total)  . ' of ' . $total; ?>
</div>
<?php print $pager ?>
<?php print $table; ?>
<?php print $pager ?>