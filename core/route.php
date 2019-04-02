<?php
use think\Route;
Route::rule('search/:autoType/:code/:token/','index/index/search/');
Route::rule('secret/login','secret/user/login');