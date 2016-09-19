angular.module('SparkOnboard.directives', [])
.directive('frontCover', function(){
	return {
		restrict: 'A',
		template: '<div class="info-container"><button ng-click="showSuperVisual()">Get Started!</button></div>',
		link: function(scope, element, attrs) {
			scope.showSuperVisual = function(){
				var tween = new TimelineMax({paused: true});
				tween.to(element, 0.5, {xPercent: -100, ease: Power2.easeOut});
				scope.$emit('shiftInSuperVisual', tween);
				tween.play();
			}
			
		}
	}
})
.directive('hero', function($timeout){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			console.log(attrs.hero);
			if(attrs.hero == "Mr Collaborator" || attrs.hero == "Congrats") {
				$timeout(function(){
					TweenLite.set(element[0], {x: "-50%"});
				});
			}
			scope.$on('characterWithIndex' + scope.$index, function(e, tween, shiftIn) {
				
				if(shiftIn){
					tween.to(element, 0.5, {x: "-50%", ease: Power2.easeOut}, 'tagsHidden');

				} else {
					// shift out
					tween.to(element, 0.5, {x: '-200%', ease: Power2.easeOut}, 'tagsHidden');
				}

			});
		}
	}
})
.directive('superVisual', function($timeout, $window){
	return {
		restrict: 'A',
		templateUrl: './templates/super-visual.html',
		link: function(scope, element, attrs){
			var cacheDOM = {};
			var promise = null;
			var s, stroke, pathLength;
			var currentIndex = 0;

			var animateTag = function(tween, open){
				scope.$emit('toggleTag', tween, open);
				scope.$emit('animateSpeechBubble', tween, open);
			};

			var rotateToConfirm = function(){
				// $timeout(function(){
					// scope.lazyLoad = "https://web.ciscospark.com/#/";
					
					var tween = new TimelineMax({paused: true});
					tween.set(element, {transformOrigin:"100% top", transformPerspective: 600})
					.to(element, 0.5, {xPercent:-50, rotationY: 30, ease: Power2.easeIn, scale: 0.85}, 0)
					.add('halfway')
					.to(element, 0.5, {xPercent:-100, rotationY: 45, ease: Power2.easeOut, scale: 1}, 'halfway');
					scope.$emit('rotateToTeam', tween);
					tween.play();
				// }, 2000);
			};
			var suggestTeamMembers = function(){
				var tween = new TimelineMax({paused: true});
				
				// tween.call(changeScope, [currentIndex]);
				tween.to(cacheDOM.positionContainer, 0.5, {x: -50, autoAlpha: 0, ease: Power2.easeOut, onComplete: changeScope, onCompleteParams: [currentIndex]}, 'tagsHidden')
				.set(cacheDOM.positionContainer, {x:50})
				.to(cacheDOM.positionContainer, 0.5, {x: 0, autoAlpha: 1, ease: Power2.easeOut});
				tween.play();
			};
			var completionPage = function(){
				var tween = new TimelineMax({paused: true});
				animateTag(tween, false);
				tween.add("tagsHidden");
				// tween.call(changeScope, [currentIndex]);
				tween.to(cacheDOM.positionContainer, 0.5, {x: -50, autoAlpha: 0, ease: Power2.easeOut, onComplete: changeScope, onCompleteParams: [currentIndex]}, 'tagsHidden')
				.set(cacheDOM.positionContainer, {x: 50})
				.to(cacheDOM.positionContainer, 0.5, {x: 0, autoAlpha: 1, ease: Power2.easeOut});
				
				scope.$broadcast('characterWithIndex' + currentIndex, tween, false);
				currentIndex++;
				scope.$broadcast('characterWithIndex' + currentIndex, tween, true);
				tween.add('shiftComplete');
				scope.$broadcast('thumbsIn', tween);
				tween.call(rotateToConfirm);
				tween.add('thumbComplete');
				scope.$emit('animateTimer', tween, 2, "thumbComplete");

				tween.play();
			};

			var panNextCharacter = function(){
				var tween = new TimelineMax({paused: true});
				
				animateTag(tween, false);
				
				tween.add("tagsHidden");
				// tween.call(changeScope, [currentIndex]);
				tween.to(cacheDOM.positionContainer, 0.5, {x: -50, autoAlpha: 0, ease: Power2.easeOut, onComplete: changeScope, onCompleteParams: [currentIndex]}, 'tagsHidden')
				.set(cacheDOM.positionContainer, {x:50})
				.to(cacheDOM.positionContainer, 0.5, {x: 0, autoAlpha: 1, ease: Power2.easeOut});
				scope.$emit('shiftBackground', tween);
				scope.$broadcast('characterWithIndex' + currentIndex, tween, false);
				currentIndex++;
				scope.$broadcast('characterWithIndex' + currentIndex, tween, true);
				tween.add('shiftComplete');
				if(scope.partOne){
					animateTag(tween, true);

				}
				tween.play();
				
				
				
			};
			// var changeInputField = function(){
			// 	scope.placeholder = 'Confirm your password';
			// 	scope.inputValue = '';
			// 	scope.nextInput = completionPage;
			// 	scope.$apply();
			// };
			// var confirmPassword = function(){
			// 	var tween = new TimelineMax({paused: true});
			// 	scope.$emit('nextInput', tween);
			// 	tween.call(changeInputField, null, this, 'allHidden');
			// 	tween.play();
			// };
			scope.partOne = attrs.superVisual == "part1";
			scope.pages = [];
			var changeScope = function(index){
				var nextIndex = index + 1;
				
				scope.heroName = scope.pages[nextIndex] ? scope.pages[nextIndex].heroName : scope.heroName;
				if(scope.partOne) {
					scope.sidePanelMessage = "The Power Of Spark\nIs Waiting!";
					scope.dialogue = "Are you ready to become a superhero?";
					scope.showInput = false;
				} else {
					if(nextIndex == 1){
						scope.sidePanelMessage = "Superheroes\nNeed A Team!";
						// scope.dialogue = "Watch Sparks fly!";
						scope.showInput = true;
						// scope.inputType = 'password';
						scope.placeholder = "Super Team Name";
						scope.buttonTitle = "Create Team";
						// scope.nextInput = completionPage;
						scope.nextInput = suggestTeamMembers;
					} else {
						// scope.sidePanelMessage = "Wham! Welcome to Spark! Your account is confirmed.";
						// scope.showInput = false;
						scope.subtext = "Add Superheroes To Your Team";
						scope.buttonTitle = "Done!";
						scope.nextInput = rotateToConfirm;

					}
					
				}
				
				scope.$apply();
			}
			
			
			
			if(attrs.superVisual == "part1"){
				scope.showInput = true;
				scope.buttonTitle = "Give Me Spark!";
				scope.placeholder = 'Enter your work email';
				scope.pages.push({
					'imgSrc' : './img/superman.png',
					'heroName' : 'Mr Collaborator',
					'background' : './img/light-blue-bg.png',
					'sidePanelMessage' : "Cisco Spark\nEmpowers The Heroes\nOf Today To Become\nThe Superheroes\nOf Tomorrow!"
					
				});
				scope.pages.push({
					'imgSrc' : './img/multitask.png',
					'heroName' : 'Ms Extraordinaire',
					'background' : './img/orange-bg.png'
				});
			} else {
				scope.showInput = true;
				scope.buttonTitle = "Wham!";
				scope.placeholder = "Superhero's Full Name";
				scope.pages.push({
					'imgSrc' : './img/congrats.png',
					'heroName' : 'Congrats',
					'background' : './img/dark-orange-bg.png',
					'sidePanelMessage' : "You Now Have The\nPower Of Spark!"
				});
				scope.pages.push({
					'imgSrc' : './img/super-team.png',
					'heroName' : 'Team',
					'background' : './img/light-blue-bg.png'
				});
				
			}
			
			
			scope.sidePanelMessage = scope.pages[0].sidePanelMessage;
			scope.inputType = 'text';
			
			scope.nextInput = panNextCharacter;
			scope.heroName = scope.pages[0].heroName;
			
			if(scope.partOne){
				scope.dialogue = "Are you ready to become a superhero?";

			} else {
				scope.dialogue = "Congrats!";

			}
			scope.subtext = scope.partOne ? "Check your email and confirm\nwith a click." : "Name Your Super Team.";
			scope.openPartTwo = function(){
				$window.open('./part2.html#?email='+scope.inputValue, '_blank');
			}
			
			var animateCheckbox = function(checked){
				stroke.stop();
				if(checked){
					stroke.animate({
						'stroke-dashoffset' : 0
					}, 250, mina.easeout);
				} else {
					stroke.animate({
						'stroke-dashoffset' : pathLength
					}, 250, mina.easeout);
				}
			}
			scope.toggleInputType = function(){
				if(scope.inputType == "password") {
					animateCheckbox(true);
					scope.inputType = 'text';
				} else {
					animateCheckbox(false);
					scope.inputType = "password";
				}
			};	
			scope.setupPassword = function(){
				$timeout.cancel(promise);
				panNextCharacter();
			};
			$timeout(function(){
				// if(!scope.partOne) {
				// 	s = Snap('#check');
				// 	stroke = s.select('#check-stroke');
				// 	pathLength = stroke.getTotalLength();
				// 	stroke.attr({
				// 		'stroke-dasharray': pathLength + ' ' + pathLength,
				// 		'stroke-dashoffset': pathLength
				// 	});
				// }
				
				cacheDOM.positionContainer = element[0].getElementsByClassName('position-container')[0];
				if(scope.partOne){
					TweenLite.set(element, {x: '100%'});
					$timeout(function(){
						var tween = new TimelineMax({paused: true});
						animateTag(tween, true);
						// tween.play();
					}, 500);
				} else {
					$timeout(function(){
						var tween = new TimelineMax({paused: true});
						scope.$emit('animateSpeechBubble', tween, open);
						tween.play();
					}, 1500);
					
					// scope.$emit('animateTimer', tween, 4.8, 'tagComplete');
					
					// promise = $timeout(function(){
					// 	panNextCharacter();
					// }, 5000);
				}
			});
			/*
			 * Receives the TimelineMax object for shifting in super visuals
			 */
			scope.$on('shiftInSuperVisual', function(e, tween) {
				tween.to(element, 0.5, {x: "0%", ease: Power2.easeOut}, 0);
				animateTag(tween, true);
			});
				
				
		}
	}
})
// .directive('imageContainer', function(){
// 	return {
// 		restrict: "A",
// 		templateUrl: './templates/image-container.html',
// 		link: function(scope, element, attrs){
// 			var cacheDOM = {};
// 			if(scope.page.heroName == 'Complete') {
			
// 				cacheDOM.img = element.find('img');
				
				
// 				TweenLite.set(cacheDOM.img, {x: '-100%', left: 0});
// 				scope.$on('thumbsIn', function(e, tween){
// 					tween.to(cacheDOM.img, 0.5, {x: '0%', ease: Power2.easeOut}, "shiftComplete");
// 				});
// 			}
// 			scope.$on('characterWithIndex' + scope.$index, function(e, tween, shiftIn) {
				
// 				if(shiftIn){
// 					tween.to(element, 0.5, {x: 0, ease: Power2.easeOut}, 'tagsHidden');

// 				} else {
// 					// shift out
// 					tween.to(element, 0.5, {x: '-100%', ease: Power2.easeOut}, 'tagsHidden');
// 				}

// 			});
// 		}
// 	}
// })
.directive('createTeam', function($timeout){
	return {
		restrict: 'A',
		templateUrl: './templates/create-team.html',
		link: function(scope, element, attrs){
			var cacheDOM = {};
			// scope.header = "Now let's assemble your team.";
			// scope.showForm = true;
			scope.users = [];
			scope.users.push({
				'src' : "./img/Elizabeth.png",
				'name' : "Elizabeth"
			});
			scope.users.push({
				'src' : "./img/Adrian.png",
				'name' : "Adrian"
			});
			scope.users.push({
				'src' : "./img/Alison.png",
				'name' : "Alison"
			});
			scope.users.push({
				'src' : "./img/David.png",
				'name' : "David"
			});
			scope.users.push({
				'src' : "./img/Catherine.png",
				'name' : "Catherine"
			});
			// var changeContent = function(){
			// 	scope.header = "Your team has been created!";
			// 	scope.showForm = false;
			// 	scope.$apply();
			// };
			var openApplication = function(tween){
				// var tween = new TimelineMax({paused: true});
				tween.set(element, {transformOrigin:"100% top", transformPerspective: 600})
				.to(element, 0.5, {xPercent:-50, rotationY: 30, ease: Power2.easeIn, scale: 0.85}, "loadingComplete+=2")
				.add('halfway')
				.to(element, 0.5, {xPercent:-100, rotationY: 45, ease: Power2.easeOut, scale: 1}, 'halfway');
				scope.$emit('rotateToApplication', tween);
				// tween.play();
			};
			$timeout(function(){
				cacheDOM.centerContent = element[0].getElementsByClassName('center')[0];
				cacheDOM.processing = element[0].getElementsByClassName('processing')[0];
				cacheDOM.flyguy = element[0].getElementsByClassName('flying-guy')[0];
				cacheDOM.finalText = element[0].getElementsByClassName('finalstatement-container')[0];
				TweenLite.set(cacheDOM.flyguy, {transformOrigin:"0 100%", xPercent:-32, yPercent:-90, scale: 0});
				// TweenLite.set(cacheDOM.processing, {autoAlpha: 0, transformOrigin: '50% 50%', xPercent: -50, yPercent: -50, scale: 0.2});
			});
			/*
			 * After a short amount of time, "loading is complete"
			 */
			var loadComplete = function(){
				$timeout(function(){
					var tween = new TimelineMax({paused: true});
					tween.to(cacheDOM.processing, 0.3, {scale: 0, ease: Power2.easeOut});
					tween.to(cacheDOM.finalText, 0.5, {autoAlpha: 1, ease: Power2.easeOut});
					tween.to(cacheDOM.flyguy, 0.5, {scale: 1});
					scope.$emit('animateSpeechBubble', tween, true);
					tween.add('loadingComplete');
					openApplication(tween);
					tween.play();
				}, 1000);
			};
			TweenMax.set(element, {xPercent: 100, transformOrigin:"0 top", transformPerspective: 600, rotationY: -45});
			scope.$on('rotateToTeam', function(e, tween) {
				tween
				.to(element, 0.5, {x: '50%', rotationY: -30, ease: Power2.easeIn, scale:0.85}, 0)
				.to(element, 0.5, {x: '0%', rotationY: 0, ease: Power2.easeOut, scale:1, onComplete:loadComplete}, 'halfway')
				.to(cacheDOM.processing, 0.3, {scale: 1, ease: Power2.easeOut});
			});
			
			// scope.createTeam = function(){
			// 	var tween = new TimelineMax({paused:true});
			// 	tween.to(cacheDOM.centerContent, 0.5, {scale: 0, autoAlpha: 0, ease:Power3.easeIn}, 0)
			// 	.to(cacheDOM.processing, 0.5, {scale:1, autoAlpha: 1, ease: Power2.easeOut}, "0+=0.2")
			// 	.add('processing')
			// 	.call(changeContent)
			// 	.to(cacheDOM.processing, 0.5, {scale:0, autoAlpha: 0, ease: Power2.easeIn}, 'processing+=3')
			// 	.to(cacheDOM.centerContent, 0.5, {scale: 1, autoAlpha: 1, ease: Power2.easeOut}, 'processing+=3')
			// 	.add('teamCreated')
			// 	.call(scope.openApplication, null, this, "teamCreated+=1");
			// 	tween.play();
			// };
		}
	}
})
.directive('userContainer', function(){
	return {
		restrict: 'A',
		template: '<img class="user-image" ng-src="{{user.src}}"></img><div class="name">{{user.name}}</div>',
		link: function(scope, element, attrs){

		}
	}
})
.directive('animate', function($timeout){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var cacheDOM = {};
			var toggleTag = function(tween, open){
				if(open){

					tween.to(element, 0.5, {scaleX: 1, ease:Power2.easeOut}, 'shiftComplete')
					.add('tagOpen')
					.to(cacheDOM.text, 0.2, {autoAlpha:1}, 'tagOpen')
					.add('tagComplete');
				} else {
					tween.to(element, 0.2, {scaleX: 0, ease:Power2.easeOut}, 0)
					.set(cacheDOM.text, {autoAlpha: 0});
				}
			};
			
			switch(attrs.animate){
				case 'dialogue':
					TweenLite.set(element, {transformOrigin: '50% 50%', scale:0.5});
					scope.$on('animateSpeechBubble', function(e, tween, open){
						if(open){
							tween.to(element, 0.3, {scale: 1, autoAlpha: 1, ease: Back.easeOut}, 'tagComplete');
						} else {
							tween.to(element, 0.2, {scale: 0.5, autoAlpha: 0, ease: Back.easeOut}, 0);
						}
					});
					break;
				case 'background':
					scope.$on('shiftBackground', function(e, tween) {
						// console.log('hi');
						
						tween.to(element, 0.5, {x: "-=100%", ease: Power2.easeOut}, 'tagsHidden');

					});

					break;
				case 'tag':
					TweenLite.set(element, {transformOrigin: "0 50%", scaleX: 0});
					cacheDOM.text = element[0].getElementsByClassName('text')[0];
					
					scope.$on('toggleTag', function(e, tween, open){
						toggleTag(tween, open);
					});
					// var tween = new TimelineMax({paused:true});
					
					// $timeout(function(){
					// 	if(attrs.tagValue == "enabler"){
					// 		toggleTag(tween, 'enabler');
					// 		scope.$emit('animateSpeechBubble', tween, 'enabler');
					// 		tween.play();
					// 	}
						
					// }, 1000);
					// scope.$on('animateDialogue', function(e, tween){
					// 	if(attrs.tagValue == "multitask"){
							
					// 		toggleTag(tween, 'multitask');
					// 		scope.$emit('animateSpeechBubble', tween, 'multitask');
					// 	}
					// });
					break;
				default:
					break;
			}
					
		}
	}
})
.directive('validateEmail', function($timeout){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			if(attrs.validateEmail == 'create-team'){
				element.on('keyup', function(e){
					if(e.keyCode == 13 && scope.inputValue.length > 0){
						scope.createTeam();
					}
				});
			} else {
				element.on('keyup', function(e){
					if(e.keyCode == 13 && scope.inputValue.length > 0){
						scope.nextInput();
					}
				});
				// scope.$on('focusInput', function(){
				// 	$timeout(function(){
				// 		element[0].focus();
				// 	});
				// });
				scope.$on('nextInput', function(e, tween){
					tween.to(element, 0.2, {autoAlpha: 0, x: -100, ease: Power2.easeOut}, 0)
					.set(element, {x: 100}, 'allHidden')
					.to(element, 0.2, {x: 0, autoAlpha: 1, ease: Power2.easeOut});

				});
			}
			
		}
	}
})
.directive('timer', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			TweenLite.set(element, {transformOrigin: "0 center", scaleX: 0});
			scope.$on('animateTimer', function(e, tween, timerDuration, position){
				tween.to(element, timerDuration, {scaleX: 1}, position)
				.add('timerComplete')
				// .call(callback, params, this, 'timerComplete')
				.to(element, 0.2, {autoAlpha: 0}, 'timerComplete')
				.set(element, {scaleX: 0, autoAlpha:1});
			});
		}
	}
})
.directive('sparkApp', function(){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			TweenMax.set(element, {xPercent: 100, transformOrigin:"0 top", transformPerspective: 600, rotationY: -45});
			scope.$on('rotateToApplication', function(e, tween) {
				tween
				.to(element, 0.5, {x: '50%', rotationY: -30, ease: Power2.easeIn, scale:0.85}, "loadingComplete+=2")
				.to(element, 0.5, {x: '0%', rotationY: 0, ease: Power2.easeOut, scale:1}, 'halfway');
			});
		}
	}
});

