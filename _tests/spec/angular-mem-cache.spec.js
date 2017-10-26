'use strict';

(function(angular) {
  beforeEach(module('ngMemCache'));

  var CacheProvider,
      LocalCache,
      $memCache,
      $timeout;

  describe('$memCache provider', function() {

    describe('User configuration', function() {
      beforeEach(module(function($memCacheProvider) {
        $memCacheProvider.init({
          expires: 750
        });
      }));

      beforeEach(inject(function(_$memCache_) {
        $memCache = _$memCache_;
      }));

      it('User configured expiration should override default', function() {
        expect($memCache.config.expires).toBe(750);
      });

    });

  });

  describe('LocalCache service', function() {

    beforeEach(inject(function(_$memCache_, _LocalCache_) {
      $memCache = _$memCache_;
      LocalCache = _LocalCache_;
    }));

    describe('Default configuration', function() {

      it('No user-configured expiration should use default value', function() {
        LocalCache.init($memCache.config);

        expect(LocalCache.config.expires).toBe(300000);
      });

    });

  });

  describe('CacheProvider service', function() {

    beforeEach(inject(function(_$timeout_, _$memCache_, _LocalCache_, _CacheProvider_) {
      $timeout = _$timeout_;
      $memCache = _$memCache_;
      LocalCache = _LocalCache_;
      CacheProvider = _CacheProvider_;
    }));

    describe('Caching workflow', function() {

      var cache,
          cacheName,
          data,
          cacheParams;

      beforeEach(function() {
        cache = CacheProvider.get();
        cacheName = 'chores';
        data = [
          {
            id: 1,
            value: 'Clean your room'
          },
          {
            id: 2,
            value: 'Empty the trash'
          }
        ];
        cacheParams = {
          group: 'household'
        };
      });

      it('CacheProvider.get() should return the single instance of the interface', function() {
        expect(cache.exists).toBeDefined();
        expect(cache.save).toBeDefined();
        expect(cache.load).toBeDefined();
        expect(cache.clean).toBeDefined();
        expect(cache.cleanGroup).toBeDefined();
      });

      it('Saving a cache should make it retrievable', function() {
        cache.save(cacheName, data, cacheParams);

        var cached = cache.load(cacheName);

        expect(cached).toEqual(data);
      });

      it('Saved cache should include an isCached flag', function() {
        cache.save(cacheName, data, cacheParams);

        var cached = cache.load(cacheName);

        expect(cached.isCached).toBe(true);
      });

    });

    describe('Cache expiration', function() {

      var cache;

      beforeEach(function() {
        cache = CacheProvider.get();
      });

      it('Expiration set in cache params should override default', function() {

        var data = {id: 123};
        var cacheParams = {expires: 500};

        cache.save('testCache', data, cacheParams);

        $timeout.flush(500);

        var cacheExists = cache.exists('testCache');

        expect(cacheExists).toBe(false);
      });

      it('Expiration set in cache params should override provider config', function() {

        var data = {id: 123};
        var cacheParams = {expires: 1000};

        cache.save('testCache', data, cacheParams);

        $timeout.flush(750);

        var cacheExists = cache.exists('testCache');

        expect(cacheExists).toBe(true);
      });
    })

  });

})(angular);