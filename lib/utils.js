/**
 * General shared utility functions
 */
'use strict';
var uuid = require('node-uuid');
var crypto = require('crypto');

var winston = require('winston');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({'timestamp': true, level: 'info'})
	]
});

var appConstants = require('./appConstants');

function getGUID(){
	return uuid.v1();
}


/**
 * Return true if passed in object has
 * @param obj
 * @return {Boolean}
 */
var isEmptyObject = function(obj) {
	return Object.keys(obj).length === 0;
};

function isNullOrUndefined(value) {
	return (value === null || (typeof value === "undefined"));
}

function generateSalt() {
	var sReturn = '';
	try {
		sReturn = crypto.randomBytes(8).toString('base64');
	} catch (error) {
		logger.error('generateSalt ERROR: ' + JSON.stringify(error));
	}
	return sReturn;
}

/**
 * creates a hash using plain text string in salt string
 * @param sPwd
 * @param sSalt
 * @return {*}
 */
function buildHash(sPwd,sSalt){
	var sReturn;
	if (!sPwd || !sSalt || sPwd.length === 0 || sSalt.length === 0) {
		sReturn = undefined;
	}
	else {
		sSalt = sSalt.toLowerCase();
		var sha256 = crypto.createHash('sha256');
		var bytBuf = new Buffer(sPwd + sSalt, 'utf16le');
		sha256.update(bytBuf);
		sReturn = sha256.digest('hex');
	}
	return sReturn;
}//buildHash

/**
 * Compares plain text password + has to stored hash, returns true if they match
 * @param sPwd
 * @param sSalt
 * @param sHash
 * @return {Boolean}
 */
function compareHash(sPwd,sSalt,sHash){
	//logger.debug('sPwd:' + sPwd + ', sSalt:' + sSalt + ', sHash:' + sHash)
	var bReturn;
	if (!sPwd || !sSalt || !sHash || sPwd.length === 0 || sSalt.length === 0 || sHash.length === 0) {
		bReturn = false;
	}
	else {
		sHash = sHash.toLowerCase();
		var hashTest = buildHash(sPwd,sSalt);
		//logger.debug('hashTest: ' + hashTest);
		bReturn = (hashTest === sHash);
	}
	return bReturn;
}//compareHash

function getNowISOString(){
	return new Date().toISOString();
}


/*
function orgAncestorsCompareFn(o1, o2) {
	try {
		var anc1 = o1.ancestors.join('.').toLowerCase();
		var anc2 = o2.ancestors.join('.').toLowerCase();

		var orgName1 = o1.orgName.value.toLowerCase();
		var orgName2 = o2.orgName.value.toLowerCase();
		if (anc1 < anc2) {
			return -1;
		}
		else if (anc1 > anc2) {
			return 1;
		}
		else {
			if (orgName1 < orgName2) {
				return -1;
			}
			else if (orgName1 > orgName2) {
				return 1;
			}
			else {
				return 0;
			}
		}
	}
	catch (err) {
		logger.error('roleType_NameCompareFn: ERROR: ' + err.toString());
		return 0;
	}
}
*/

/**
 * Processes passed in Org array into tree and hashtable lookup.
 * Requires that objects have a "parent" id reference,
 * and that the list is sorted by ancestor path
 * @param aItem
 * @returns {{trees: Array, dict: {}}}
 */
function buildItemTree(aItem) {
	var aOrgTree = [];
	var oNodeDict = {};
	var oNode;
	var sParentId;
	var oReturn = {tree: aOrgTree, dict: oNodeDict};

	for (var i = 0, len = aItem.length; i < len; i++) {                         //loop over all the org select objects
		var oOrg = aItem[i];
		if (!oOrg.children) {                                                     //add the children property if it does not exist, or we get binding errors
			oOrg.children = [];
		}

		oNodeDict[oOrg._id] = oOrg;                                               //put the object in a hash list for later quick reference
		sParentId = oOrg.ancestors[oOrg.ancestors.length - 1];                    //get the parent id of the current object

		if (oNodeDict.hasOwnProperty(sParentId)) {                                //if the parent is already in our hash list
			oNode = oNodeDict[sParentId];
			oNode.children.push(oOrg);                                              //push the current object onto its children array
			oNode.isFolder = true;
		}
		else {                                                                    //otherwise, it must be a root or single org
			aOrgTree.push(oOrg);                                                    //so add it to our return array
		}
	}
	return oReturn;
}

function trimISO(sISODateString) {
	return sISODateString.substr(0,10);
}

function getDaySection(dt) {
	var sReturn = appConstants.EVENING;
	var hour = dt.getHours();
	if (hour <= appConstants.MORNING.hour) {
		sReturn = appConstants.MORNING;
	}
	else if (hour <= appConstants.AFTERNOON.hour) {
		sReturn = appConstants.AFTERNOON;
	}
	return sReturn;
}


exports.isEmptyObject = isEmptyObject;

exports.isNullOrUndefined = isNullOrUndefined;
exports.buildHash = buildHash;
exports.compareHash = compareHash;
exports.generateSalt = generateSalt;
exports.getGUID = getGUID;
exports.getNowISOString = getNowISOString;

exports.buildItemTree = buildItemTree;

exports.trimISO = trimISO;
exports.getDaySection = getDaySection;

