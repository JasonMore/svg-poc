describe('liveResource.js >', function () {
  // setup require

  var racerModel, racer;

  beforeEach(function () {
    racerModel = jasmine.createSpyObj('racerModel', [
      'unload',
      'on',
      'add',
      'at',
      'query',
      'del',
      'get',
      'subscribe',
      'scope',
      'setDiff'
    ]);

    racer = {
      init: function () {
      },
      ready: function (fn) {
        fn(racerModel);
      }
    };

    window.require = function () {
      // assuming racer.js
      return racer;
    };
  });

  beforeEach(module('liveResource'));

  var liveResourceProvider;

  describe('loading liveResourceProvider >', function () {
    var $httpBackend, $timeout;

    beforeEach(inject(function (_$httpBackend_) {
      spyOn(racer, 'ready').andCallThrough();
      spyOn(racer, 'init');

      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('/racerInit').respond({});
    }));

    // act
    beforeEach(inject(function (_liveResourceProvider_, _$timeout_) {
      liveResourceProvider = _liveResourceProvider_;
      $timeout = _$timeout_;

      $httpBackend.flush();
    }));

    it('calls ready', function () {
      expect(racer.ready).toHaveBeenCalled();
    });

    it('calls init', function () {
      expect(racer.init).toHaveBeenCalled();
    });

    describe('create live resource >', function () {
      var successFn, errorFn, liveResource;

      beforeEach(function () {
        successFn = jasmine.createSpy('successFn');
        successFn.andCallFake(function (returnService) {
          liveResource = returnService('objectModelPathToSave');
        });

        errorFn = jasmine.createSpy('errorFn');

        liveResourceProvider.createLiveResource.then(successFn, errorFn);

        $timeout.flush();
      });

      it('resolves the promise', function () {
        expect(successFn).toHaveBeenCalled();
      });

      it('does not call error function', function () {
        expect(errorFn).not.toHaveBeenCalled();
      });

      it('sets liveResource', function () {
        expect(liveResource).toBeDefined();
      });

      describe('liveResource >', function () {
        it('sets _racerModel', function () {
          expect(liveResource._racerModel).toBe(racerModel);
        });

        describe('add >', function () {
          var newModel, result, addCall;

          beforeEach(function () {
            racerModel.add.andCallFake(function () {
              return 'objectModelPathToSave.abc123'
            });

            newModel = {
              foo: 'bar',
              '$$hashKey': 'a01'
            };

            //act
            result = liveResource.add(newModel);

            // spy result
            addCall = racerModel.add.mostRecentCall;
          });

          it('calls racerModel.add', function () {
            expect(racerModel.add).toHaveBeenCalled();
          });

          it('calls add on objectModelPathToSave', function () {
            expect(addCall.args[0]).toEqual('objectModelPathToSave');
          });

          it('creates a copy of the model', function () {
            expect(addCall.args[1]).not.toBe(newModel);
          });

          it('excludes $$hashKey', function () {
            expect(addCall.args[1]).toEqual({foo: 'bar'});
          });

          // not sure if this is right
          it('returns result of id', function () {
            expect(result).toEqual('objectModelPathToSave.abc123');
          });
        });

        describe('at >', function () {
          var result, atReturnValue;

          beforeEach(function () {
            atReturnValue = {foo: 'bar'};

            racerModel.at.andCallFake(function () {
              return atReturnValue;
            });

            // act
            result = liveResource.at();
          });

          it('returns atReturnValue', function () {
            expect(result).toBe(atReturnValue);
          });

          it('calls racerModel.at', function () {
            expect(racerModel.at).toHaveBeenCalledWith('objectModelPathToSave');
          })
        });

        describe('query >', function () {
          var result, queryReturnValue, queryParams;

          beforeEach(function () {
            queryReturnValue = {foo: 'bar'};

            racerModel.query.andCallFake(function () {
              return queryReturnValue;
            });

            // act
            result = liveResource.query(queryParams);
          });

          it('returns queryReturnValue', function () {
            expect(result).toBe(queryReturnValue);
          });

          it('calls racerModel.query', function () {
            expect(racerModel.query).toHaveBeenCalledWith('objectModelPathToSave', queryParams);
          })
        });

        describe('delete >', function () {
          var act, result, delReturnValue, modelOrId;

          beforeEach(function () {
            delReturnValue = {id: 'abc123', name: 'Jason'};

            racerModel.del.andCallFake(function () {
              return delReturnValue;
            });

            act = function () {
              result = liveResource.del(modelOrId);
            };
          });

          describe('delete model >', function () {
            beforeEach(function () {
              modelOrId = {id: 'abc123', name: 'Jason'};
            });

            it('deletes correct id', function () {
              act();
              expect(racerModel.del).toHaveBeenCalledWith('objectModelPathToSave.abc123');
            });

            it('returns the model', function () {
              act();
              expect(result).toBe(delReturnValue);
            });
          });

          describe('delete id >', function () {
            beforeEach(function () {
              modelOrId = 'abc123';
            });

            it('deletes correct id', function () {
              act();
              expect(racerModel.del).toHaveBeenCalledWith('objectModelPathToSave.abc123');
            });

            it('returns the model', function () {
              act();
              expect(result).toBe(delReturnValue);
            });
          });
        });

        describe('get >', function () {
          var result, getReturnValue;

          beforeEach(function () {
            getReturnValue = {foo: 'bar'};

            racerModel.get.andCallFake(function () {
              return getReturnValue;
            });

            // act
            result = liveResource.get();
          });

          it('returns getReturnValue', function () {
            expect(result).toBe(getReturnValue);
          });

          it('calls racerModel.get', function () {
            expect(racerModel.get).toHaveBeenCalledWith('objectModelPathToSave');
          })
        });

        describe('scope >', function () {
          var result, scopeReturnValue, subpath;

          beforeEach(function () {
            scopeReturnValue = {foo: 'bar'};

            subpath = 'abc123';

            racerModel.scope.andCallFake(function () {
              return scopeReturnValue;
            });

            // act
            result = liveResource.scope(subpath);
          });

          it('returns scopeReturnValue', function () {
            expect(result).toBe(scopeReturnValue);
          });

          it('calls racerModel.scope', function () {
            expect(racerModel.scope).toHaveBeenCalledWith('objectModelPathToSave.abc123');
          })
        });

        describe('subscribe >', function () {
          var act, liveData, query;

          beforeEach(function () {
            racerModel.subscribe.andCallFake(function (queryOrScope, callback) {
              callback();
            });

            act = function () {
              liveData = liveResource.subscribe(query);
            };
          });

          describe('with no query > ', function () {
            var atRoot;
            beforeEach(function () {
              atRoot = {id: 'atRoot'};

              racerModel.at.andCallFake(function () {
                return atRoot;
              });

              act();
            });

            it('calls racer at since no query was sent in', function () {
              expect(racerModel.at).toHaveBeenCalledWith('objectModelPathToSave');
            });

            it('calls subscribe with root scope', function () {
              expect(racerModel.subscribe).toHaveBeenCalledWith(atRoot, jasmine.any(Function));
            });
          });

          describe('with query >', function () {
            beforeEach(function () {
              function Query() {
                this.query = 'abc123';
                this.ref = jasmine.createSpy('ref');
              }

              query = new Query();

              act();
            });

            it('calls racer subscribe with query', function () {
              expect(racerModel.subscribe).toHaveBeenCalledWith(query, jasmine.any(Function));
            });

            it('creates a page reference', function () {
              expect(query.ref).toHaveBeenCalledWith('_page_.objectModelPathToSave');
            });

            it('returns liveData with no data', function () {
              expect(liveData).toEqual({});
            });

            describe('getting data after timeout >', function () {
              var testData, model;
              var string, bool, number, object;
              var objectString, childObject, childObjectString;
              var array, arrayItem0, arrayItem1, arrayItem2;

              beforeEach(function () {
                string = 'foobar123';
                bool = true;
                number = 123;

                childObjectString = 'mr fancy pants';
                childObject = {
                  childObjectString: childObjectString
                };

                objectString = 'hello world';
                object = {
                  objectString: objectString,
                  childObject: childObject
                };

                arrayItem0 = {
                  id: 'arrayItem0',
                  string: 'arrayItem0String'
                };
                arrayItem1 = 'arrayItem1';
                arrayItem2 = ['arrayItem2'];
                array = [arrayItem0, arrayItem1, arrayItem2];

                model = {
                  'id': 'abc123',
                  string: string,
                  bool: bool,
                  number: number,
                  object: object,
                  array: array
                };

                testData = {
                  'abc123': model
                };

                racerModel.get.andCallFake(function () {
                  return testData;
                });

                $timeout.flush();
              });

              it('calls racer get', function () {
                expect(racerModel.get).toHaveBeenCalledWith('objectModelPathToSave');
              });

              it('extends liveData reference with server data', function () {
                expect(liveData).toEqual(testData);
              });

              describe('updating live data >', function () {
                var $rootScope;

                beforeEach(inject(function (_$rootScope_) {
                  $rootScope = _$rootScope_;

                  act = function () {
                    $rootScope.$digest();
                  }
                }));

                describe('updating string >', function () {
                  beforeEach(function () {
                    liveData['abc123'].string = 'hello there';
                    act();
                  });

                  it('calls setDiff', function () {
                    expect(racerModel.setDiff).toHaveBeenCalledWith('objectModelPathToSave.abc123.string', 'hello there');
                  });
                });

                describe('updating bool >', function () {
                  beforeEach(function () {
                    liveData['abc123'].bool = false;
                    act();
                  });

                  it('calls setDiff', function () {
                    expect(racerModel.setDiff).toHaveBeenCalledWith('objectModelPathToSave.abc123.bool', false);
                  });
                });

                describe('updating number >', function () {
                  beforeEach(function () {
                    liveData['abc123'].number = 100000;
                    act();
                  });

                  it('calls setDiff', function () {
                    expect(racerModel.setDiff).toHaveBeenCalledWith('objectModelPathToSave.abc123.number', 100000);
                  });
                });

                describe('adding new property >', function () {
                  beforeEach(function () {
                    liveData['abc123'].newString = 'why hello there';
                    act();
                  });

                  it('calls setDiff', function () {
                    expect(racerModel.setDiff).toHaveBeenCalledWith('objectModelPathToSave.abc123.newString', 'why hello there');
                  });
                });

                xdescribe('updating array item 0 >', function () {
                  beforeEach(function () {
                    liveData['abc123'].array[0].arrayItem0String = 'hello there';
                    act();
                  });

                  it('calls setDiff', function () {
                    expect(racerModel.setDiff).toHaveBeenCalledWith('objectModelPathToSave.abc123.array.0.arrayItem0String', 'hello there');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});