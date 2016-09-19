"use strict";
angular.module('SparkOnboard', ['SparkOnboard.directives'])
.config(function($sceProvider){
	$sceProvider.enabled(false);
});