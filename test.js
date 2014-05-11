var app = angular.module("testApp", ['tree']);

app.controller("TreeCtrl", function($scope, $timeout){

  var data = [
    {'id':1, 'parentId' : 0, name: 'node1'},
    {'id':2 ,'parentId' : 1, name: 'node2'},
    {'id':3 ,'parentId' : 1, name: 'node3'},
    {'id':4 ,'parentId' : 2, name: 'node4'},
    {'id':5 ,'parentId' : 0, name: 'node5'},
    {'id':6 ,'parentId' : 0, name: 'node6'},
    {'id':7 ,'parentId' : 4, name: 'node7'}
  ];

  var treeify = function (array, parent, tree) {
    tree = tree || [];
    parent = parent || { id : 0 };

    var children = _.filter( array, function(child){ return child.parentId == parent.id; });

    if( !_.isEmpty( children )  ){
        if( parent.id == 0 ){
           tree = children;
        }else{
           parent['children'] = children
        }
        _.each( children, function( child ){ treeify ( array, child ) } );
    }
    return tree;
  }

  $scope.add = function(){
    $scope.handle.appendNode({
      id : new Date().valueOf(),
      name : new Date()
    });
  }

  $scope.remove = function(){
    $scope.handle.removeNode();
  }

  $scope.$watch('keyword', function(newVal){
    var getParents = function(list, node) {
      if (node) {
        if (node.parentId != 0) {
          var parent = _.filter(data, function(n) { 
            return n.id == node.parentId;
          });
          if (parent && parent[0]) {
            if (!list.hash[parent[0].id]) {
              list.hash[parent[0].id] = 1;
              list.list.push(parent[0]);
            }
            getParents(list, parent[0]);
          }
        }
      }
    }

    var nodes = _.filter(data, function(node){ return node.name.indexOf(newVal) >= 0});
    var list = {
      hash: {},
      list: []
    };
    _.each(nodes, function(node) {
      // For each node, append itself to the list...
      if (!list.hash[node.id]) {
        list.hash[node.id] = 1; // (add to the list if it's not yet on the list)
        list.list.push(node);
      }
      // ... and get it's parents
      getParents(list, node);
    });
    // todo get all parents
    $scope.data = treeify(list.list)
  });

  $timeout(function(){
    $scope.data = treeify(data)
    $scope.selectedNodes = [];
    $scope.multiple = false;
  });

});
