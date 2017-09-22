'use strict';

(function(angular) {

  angular.module('ngMemCache', [])

  .service('LocalCache', ['$timeout', function($timeout) {

    var config = {};
    var _caches = [];
    var _defaults = {
      expires: 300000
    };

    /**
     * Initialize service with configs
     *
     * @function
     * @param {Object} options - Custom configs from client
     * @param {number} options.expires - Time in ms to keep caches alive
     */
    var init = function(options) {
      if (!options) {
        config = angular.extend({}, _defaults);
        return;
      }

      for (var conf in _defaults) {
        config[conf] = options[conf] || _defaults[conf];
      }
    };

    /**
     * Checks if specified cache exists
     *
     * @function
     * @param {string} cacheId - Name of the cache to check
     * @returns {boolean}
     */
    var exists = function(cacheId) {
      var cacheExists = angular.isDefined(_caches[cacheId]);
      var hasData = (cacheExists && _caches[cacheId].current !== null);
      return hasData;
    };

    /**
     * Reset the specified cache
     *
     * @function
     * @param {string} cacheId - Name of the cache to reset
     */
    var clean = function(cacheId) {
      _caches[cacheId] = {
        current: null
      };
    };

    /**
     * Reset every cache in the specified cache group
     *
     * @function
     * @param {string} groupId - Name of the group to reset
     */
    var cleanGroup = function(groupId) {
      var current, property;
      for (property in _caches) {
        current = _caches[property];
        if (current.group === groupId) {
          clean(property);
        }
      }
    };

    /**
     * Create a new cache
     *
     * @function
     * @param {string} cacheId - Name of the cache to create
     * @param {Object} data - The object to cache
     * @param {Object} params - Option params for the cache
     * @param {string} [params.group] - Name of the group to which this cache belongs
     */
    var save = function(cacheId, data, params) {
      _caches[cacheId] = angular.extend({}, params);
      _caches[cacheId].current = data;

      $timeout(function() {
        clean(cacheId);
      }, config.expires);
    };

    /**
     * Get existing cache
     *
     * @function
     * @param {string} cacheId - Name of the cache to get
     * @returns {Object} The cached data with a flag to tell client the data is from cache
     */
    var load = function(cacheId) {
      var cachedData = _caches[cacheId].current;
      cachedData.isCached = true;
      return cachedData;
    };

    /**
     * Clear all caches
     *
     * @function
     */
    var destroy = function() {
      _caches = [];
      return null;
    };

    return {
      init: init,
      exists: exists,
      save: save,
      load: load,
      clean: clean,
      cleanGroup: cleanGroup,
      destroy: destroy,
      config: config
    };

  }])
    
  .service('CacheProvider', ['$memCache', 'LocalCache', function($memCache, LocalCache) {

    var _this = this;
    var _cache = null;

    /**
     * Interface for LocalCache service
     *
     * @function
     * @param {Object} options - Custom configs from client
     */
    var cacheInterface = function(options) {

      LocalCache.init(options);

      return {
        exists: function(cacheId) {
          return LocalCache.exists(cacheId);
        },
        save: function(cacheId, data, params) {
          return LocalCache.save(cacheId, data, params);
        },
        load: function(cacheId) {
          return LocalCache.load(cacheId);
        },
        clean: function(cacheId) {
          return LocalCache.clean(cacheId);
        },
        cleanGroup: function(groupId) {
          return LocalCache.cleanGroup(groupId);
        }
      };
    };

    /**
     * Create a new instance of the cache service
     *
     * @function
     * @param {Object} options - Custom configs from client
     */
    var createCache = function(options) {
      return new cacheInterface(options);
    };

    /**
     * Get the current instance of the cache service
     *
     * @function
     * @return {Object}
     */
    _this.get = function() {
      return _cache;
    };

    /**
     * Reset a specified cache
     *
     * @function
     * @param {string} cacheId - Name of the cache to reset
     * @param {boolean} isGroup - If true, cacheId becomes the name of the group to reset
     */
    _this.clean = function(cacheId, isGroup) {
      if (!_cache) {
        return;
      }

      var clean = (isGroup) ? _cache.cleanGroup : _cache.clean;
      return clean(cacheId);
    };

    /**
     * Clear all caches and create new instance of cache service
     *
     * @function
     */
    _this.destroy = function() {
      LocalCache.destroy();
      _cache = createCache($memCache.config);
    };

    /**
     * Initialize cache service with configs
     *
     * @function
     */
    function init() {
      _cache = createCache($memCache.config);
    }
    init();

    return _this;
  }])

  .provider('$memCache', function() {

    var config = {};

    return {
      init: function(options) {
        config = options;
      },
      $get: function() {
        return {
          config: config
        };
      }
    };

  });

})(angular);