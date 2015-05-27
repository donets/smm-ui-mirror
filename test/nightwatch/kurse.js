module.exports = {
  tags: ['kurses'],
  
	'Open Home page': function (browser) {
	var neighbourhoodsActive=[];
	var neighbourhoodsInActive=[];
	var ListNBH=[];
	var params = browser.globals;
	var assert= this.client.assert;
	
	function IsIntersect(arr1,arr2) {
		var intersect=0;
		for(i = 0; i < arr1.length; i++) {
			for(j = 0; j < arr2.length; j++) {
				if (arr1[i] === arr2[j]) { 
					intersect++;
					break;
				}
			}
		}
		return intersect;
	}
	browser
		.url(params.baseUrl + '/p/kurse/4/')//london
		.waitForElementVisible('tr.ng-scope:nth-child(1) > td:nth-child(4) > span:nth-child(2)', browser.globals.waitPOST)
		.windowMaximize()
		.execute('$("#neigbourhood").triggerHandler("chosen:open");')
		.elementIdClick('#neigbourhood_chosen')
		.waitForElementVisible('#neigbourhood_chosen > div:nth-child(2) > ul:nth-child(2) > li.active-result',browser.globals.waitUI)
		.elements('css selector','#neigbourhood_chosen > div:nth-child(2) > ul:nth-child(2) > li.active-result', function (elements) {
			elements.value.forEach(function(element) {
				browser.elementIdText(element.ELEMENT, function(result){
					//console.log(result.value)
					neighbourhoodsActive.push(result.value)
				})
			})
        })
		.elements('css selector','#neigbourhood_chosen > div:nth-child(2) > ul:nth-child(2) > li.disabled-result', function (elements) {
			elements.value.forEach(function(element) {
				browser.elementIdText(element.ELEMENT, function(result){
					//console.log(result.value)
					neighbourhoodsInActive.push(result.value)
				})
			})
        })
		.elements('css selector','tr.ng-scope> td:nth-child(4) > span:nth-child(2)', function (elements) {
			elements.value.forEach(function(element) {
				browser.elementIdText(element.ELEMENT, function(result){
					//console.log(result.value)
					ListNBH.push(result.value)
				})
			})
        })
		.perform(function(browser,done) {
			assert.equal(neighbourhoodsActive.length,IsIntersect(neighbourhoodsActive,ListNBH));
			assert.equal(0,IsIntersect(neighbourhoodsInActive,ListNBH));
			done();
		})
		.end();
	}
}