var tree = angular.module('tree', []);
tree.directive('jqtree', function($parse){
  return {
    restrict : 'A',
    replace : true,
    template : '<div></div>',
    scope : {
      jqtreeSelectedNodes : '=', // it can be [node] if single or [node1, node2, ...] if multiple
      jqtreeModel : '=',
      jqtreeSelectNode : '&',
      jqtreeMultiple : '=',
      jqtreeHandle : '='
    },
    link : function($scope, $element, $attrs){

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
      });

      // events
      $scope.bindEvents = function(){

        $scope.handle.bind('tree.select', function(event){
          $scope.fromEvent = true;

          if (event.node) {
            $scope.select(event.node);
          } else {
            $scope.deselect(event.previous_node);
          }
        });

        $scope.handle.bind('tree.contextmenu', function(event){
          console.log(event);
        });

        // decorate with some helpers
        $scope.handle.appendNode = function(data){
          $scope.jqtreeSelectedNodes = $scope.jqtreeSelectedNodes || [];
          if ($scope.jqtreeSelectedNodes.length != 1) return;

          // get the current node as parent
          var parent = $scope.jqtreeSelectedNodes[0];
          var node = $scope.jqtreeHandle.tree('appendNode', data, parent);

          // select the newly created node
          $scope.select(node);
        }

        $scope.handle.removeNode = function(){
          $scope.jqtreeSelectedNodes = $scope.jqtreeSelectedNodes || [];

          if ($scope.jqtreeSelectedNodes.length != 1) return;
          var node = $scope.jqtreeSelectedNodes[0];
          $scope.jqtreeHandle.tree('removeNode', node);

          $scope.safeApply(function(){
            $scope.jqtreeSelectedNodes = [];
          });
          // todo: select its parent
        }
      }

      $scope.addToSelection = function (node){
        if (!jqtreeMultiple) return;
        $scope.handle.tree('addToSelection', node);
      }

      $scope.removeFromSelection = function (node){
        if (!jqtreeMultiple) return;
        var node = $scope.handle.tree('getNodeById', node.id);
        $scope.handle.tree('removeFromSelection', node);
      }

      // to model
      $scope.select = function(node){
        $scope.safeApply(function(){
          if ($scope.jqtreeMultiple) {
            $scope.jqtreeSelectedNodes = $scope.jqtreeSelectedNodes || [];
          } else {
            $scope.jqtreeSelectedNodes = [];
          }
          $scope.jqtreeSelectedNodes.push(node);
          $scope.selectNode(node);
        });
      }

      $scope.deselect = function(node){
        $scope.safeApply(function(){
          if ($scope.jqtreeMultiple) {
            $scope.jqtreeSelectedNodes = $scope.jqtreeSelectedNodes || [];
          } else {
            $scope.jqtreeSelectedNodes = [];
          }
          $scope.jqtreeSelectedNodes.splice(1, node);
        });
      }

      // to visual element
      $scope.selectNode = function(node){
        $scope.safeApply(function(){
          $scope.handle.tree('selectNode', node);
        });
      }
    }
  }
});
