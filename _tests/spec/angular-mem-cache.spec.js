'use strict';

(function(angular) {

  describe('LocalCache service', function() {
    beforeEach(module('ngMemCache'));

    var LocalCache,
      $timeout;

    beforeEach(inject(function(_$timeout_, _LocalCache_) {
      $timeout = _$timeout_;
      LocalCache = _LocalCache_;
    }));

    it('show should be public', function() {
      expect(true).toBeDefined();
    });

  });

})(angular);