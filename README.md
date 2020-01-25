# angular-mem-cache
In-memory caching service for AngularJS

[![npm version](https://badge.fury.io/js/angular-mem-cache.svg)](https://badge.fury.io/js/angular-mem-cache) [![CircleCI](https://circleci.com/gh/shaunetobias/angular-mem-cache.svg?style=svg&circle-token=edde34a0a62770e6e2ef5554a257e58bb951ee37)](https://circleci.com/gh/shaunetobias/angular-mem-cache)

## Dependencies
Angular ^1.5.0

## Install

npm: `npm i angular-mem-cache`

Yarn: `yarn add angular-mem-cache`

## Configuration

    angular.module('myApp', ['ngMemCache'])
    
    .config(function($memCacheProvider) {
    
      $memCacheProvider.init({
        expires: 30000
      });
      
    });


## Basic Use
The following are operations you would run where handling data. Usually in a request service that handles all of your XHR requests.

    //instantiate cache
    var cache = CacheProvider.get();
    
    //cache data
    cache.save('current_user', {name: Dave Smith});
    
    //check if cache exists
    cache.exists('current_user');
    
    //load cached data
    cache.load('current_user');
    
    
    
## Cache Groups
Multiple caches can be grouped to make validation and deletion of multiple caches simple.

    //cache different data in same group
    cache.save('current_user', {name: Dave Smith}, {group: 'globals'});
    cache.save('session_id', 'Fdfhk41254VFCfa4T32FDSF4yh23498', {group: 'globals'});



## Deleting Caches
As the CacheProvider is a singleton, the following operations can be called anywhere in the application, e.g. a logout controller.

    //delete single cache
    CacheProvider.clean('current_user');
    
    //delete each cache in group
    CacheProvider.clean('globals', true);
    
    //destroy cache instance
    CacheProvider.destroy();



## Expiring Caches
Cache expiration time can be configured on two levels: using a provider to set a global expiration time, or in the cacheParams during each cache.save() to set expirations on individual caches. Order of precedence is: individual, global, global default (300000). All times are in milliseconds.

    //global level
    .config(function($memCacheProvider) {
    
      $memCacheProvider.init({
        expires: 20000
      });
      
    });
    
    //individual level
    var cache = CacheProvider.get();
    cache.save('tasks_due', [id: 123], cacheParams: {expires: 60000});
    


## Example

    angular.module('myApp', ['ngMemCache'])
    
    .config(function($memCacheProvider) {
    
      $memCacheProvider.init({
        expires: 30000
      });
      
    })
    
    .service('RequestClient', function($http, CacheProvider) {
    
      var cache = CacheProvider.get();
      
      return {
        get: function(options) {
        
          if (cache.exists(options.cacheId)) {
            return cache.load(options.cacheId);
          } else {
          
            $http(options)
            .then(function(response) {
              cache.save(options.cacheId, response, options.cacheParams);
              
              return response;
            });
            
          }
          
        }
      };
      
    })
    
    .controller('TasksCtrl', function($scope, RequestClient, CacheProvider) {
    
      $scope.tasks = {};
      
      $scope.getDueTasks = function() {
        return RequestClient.get({
          url: '/api/tasks/due',
          cacheId: 'tasks_due',
          cacheParams: {
            group: 'tasks',
            expires: 60000
          }
        });
      };
      
      $scope.getClosedTasks = function() {
        return RequestClient.get({
          url: '/api/tasks/closed',
          cacheId: 'tasks_closed',
          cacheParams: {
            group: 'tasks'
          }
        });
      };
      
      $scope.refreshTasks = function() {
        CacheProvider.clean('tasks', true);
        $scope.loadTasks();
      };
      
      $scope.loadTasks = function() {
        $scope.tasks.due = $scope.getDueTasks();
        $scope.tasks.closed = $scope.getClosedTasks();
      };
      
      function init() {
        $scope.loadTasks();
      }
      init();
      
    });
    
    
