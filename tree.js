var tree = angular.module('tree', []);
tree.directive('jqtree', function(){
  return {
    restrict : 'A',
    replace : true,
    template : '<div></div>',
    scope : {
      jqtreeSelectedNodes : '=', // it can be [node] if single or [node1, node2, ...] if multiple
      jqtreeModel : '=',
      jqtreeSelectNode : '&',
      jqtreeMultiple : '@',
      jqtreeHandle : '='
    },
    link : function($scope, $element, $attrs){

      // shorthands

      // helper on safeApply
      $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };

      // on ready
      $(function(){
        // watch the model changes
        $scope.$watch('jqtreeModel', function (newValue, oldValue) {
          if(!$scope.handle) {
            $scope.handle = $element.tree({ data : newValue });
            $scope.jqtreeHandle = $scope.handle;
            return $scope.bindEvents();
          }
          $scope.handle.tree('loadData', newValue);
        });

        $scope.$watch('jqtreeSelectedNodes', function (newValue, oldValue) {

        }, true);

      });

      // events
      $scope.bindEvents = function(){

        $scope.handle.bind('tree.select', function(event){
          console.log('select');
        });

        $scope.handle.bind('tree.contextmenu', function(event){
          console.log(event);
        });

        // decorate with some helpers
        $scope.handle.appendNode = function(data){
          $scope.jqtreeSelectedNodes.push({});
        }

        $scope.handle.removeNode = function(){
        }
      }

      // to model
      $scope.select = function(node){
      }

      $scope.deselect = function(node){
      }

      // to visual element
      $scope.selectNode = function(node){
      }
    }
  }
});
