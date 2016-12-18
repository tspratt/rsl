/**
 * Created by Tracy on 9/19/2016.
 */
angular.module('rsl')
		.controller('linksCtrl', ['$scope', '$state','appConstants', 'appData',
			function ($scope, $state, appConstants, appData) {
				$scope.vm = {};
				$scope.vm.addLinkDetail = false;
				$scope.vm.links = [];
				$scope.vm.label = '';
				$scope.vm.url = '';
				$scope.addLink = function () {
					$scope.vm.links.push({label: $scope.vm.label, url:$scope.vm.url})
				};

				function init () {
					$scope.vm.links = [
						{label:'Lake Rabun', url:'http://www.lakerabun.com/'},
						{label:'LRA', url:'http://www.lakerabun.org/'},
						{label:'Lake Rabun Hotel', url:'http://www.lakerabunhotel.com/'},
						{label:'GPC Lake Levels', url:'https://lakes.southernco.com/'},
						{label:'GPC North Georgia Lakes', url:'https://georgiapowerlakes.com/northgeorgialakes/'},
						{label:'Burton/Rabun on Facebook', url:'https://www.facebook.com/burtonrabun/'},
						{label:'Rabun Ramble', url:'http://rabunramble.com/'},
						{label:'Explore Rabun', url:'http://explorerabun.com/'},
						{label:'GPC Account', url:'https://customerservice.southerncompany.com/NonSecure/LoginFrames.aspx?ReturnUrl=%2fMyAccount.aspx%3fmnuOpco%3dgpc%26rhp%3dlm_my_account_login&mnuOpco=gpc&rhp=lm_my_account_login'},
						{label:'TruVista Bill Pay', url:'https://billpay.truvista.net/esp/security/login?ReturnUrl=https%3a%2f%2fbillpay.truvista.net%2fesp'}
					]
				}

				init();
			}])
		.directive('newWindow', function ($location, $window) {
			return {
				link: function (scope, element, attrs) {
					element.on("click", function () {
						$window.open(attrs.newWindow);
					});
				}
			}
		});