<?php
define('APP_PATH', __DIR__ . '/../core/');
define('PUB_PATH', __DIR__);
define('__APP__','https://'.$_SERVER['HTTP_HOST'] . '/static/');
define('__UI__','https://'.$_SERVER['HTTP_HOST'] . '/ui/');
define('__UIL__','https://'.$_SERVER['HTTP_HOST'] . '/ui/start/');
require __DIR__ . '/../thinkphp/start.php';
