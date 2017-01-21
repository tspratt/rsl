/**
 * Created by Tracy on 11/12/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var mgSchema = {
	Person: new Schema({
		firstname: String,
		lastname: String,
		member: {
			type: Schema.ObjectId,
			ref: 'Member'
		},
		memberrelationship: String,
		parent: {
			firstname: String,
			lastname: String
		},
		address: String,
		phone: String,
		email: String,
		role: String,
		permissions: [String],
		smsActions: Object
	}, {collection: 'persons'})
			.plugin(deepPopulate, {}),
	Member: new Schema({
		llcName: String,
		branch: {
			type: Schema.ObjectId,
			ref: 'Branch'
		},
		share: Number,
		defaultroom: Schema.ObjectId,
		order: Number,
		abr2: String,
		abr3: String
	}, {collection: 'members'})
			.plugin(deepPopulate, {}),
	User: new Schema({
		person: {type: Schema.ObjectId, ref: 'Person'},
		userid: String,
		passwordHash: String,
		salt: String
	}, {collection: 'users'})
			.plugin(deepPopulate, {}),
	Branch: new Schema({
		branchname: String,
		parentid: Schema.ObjectId,
		share: Number,
		unit: String
	}, {collection: 'branches'}),
	Property: new Schema({
		name: String,
		description: String,
		capacity: Number,
		expandable: Number,
		images: [String]
	}, {collection: 'properties'}),
	Unit: new Schema({
		property: String,
		number: String,
		description: String,
		capacity: Number,
		expandable: Number,
		branchid: Schema.ObjectId,
		branch: {
			type: Schema.ObjectId,
			ref: 'Branch'
		},
		images: [String]
	}, {collection: 'units'})
			.plugin(deepPopulate, {}),
	Room: new Schema({
		defaultmember: {type: Schema.ObjectId, ref: 'Member'},
		order: Number,
		number: String,
		unitid: Schema.ObjectId,
		unit: String,
		description: String,
		capacity: Number,
		expandable: Number,
		displayName: String,
		images: [String]
	}, {collection: 'rooms'}),
	Booking: new Schema({
		memberResident: {type: Schema.ObjectId, ref: 'Member'},
		member: {type: Schema.ObjectId, ref: 'Member'},
		room: {type: Schema.ObjectId, ref: 'Room'},
		who: [{type: Schema.ObjectId, ref: 'Person'}],
		whoCount: Number,
		guestRoomRequests: [
				{responsibleMemberId: String,
					grantingMemberId: String,
					roomId: String,
					personId: String,
					guestCount:Number,
					note:String}
				],
		guestRoomRequestCount: Number,
		arrive: String,
		depart: String,
		note: String,
		guestPersonId: String,
	}, {collection: 'bookings'})
			.plugin(deepPopulate, {}),
	GuestBooking: {
		responsibleMember: {type: Schema.ObjectId, ref: 'Member'},
		grantingMember: {type: Schema.ObjectId, ref: 'Member'},
		room:{type: Schema.ObjectId, ref: 'Room'},
		person: {type: Schema.ObjectId, ref: 'person'},
		guestCount:Number,
		note:String
	},
	Residence: new Schema({
		index: Number,
		dt: Date,
		sDt: String,
		daySectionIndex: Number,
		daySection: {
			hour: Number,
			minute: Number,
			second: Number,
			millisecond: Number,
			lclabel: String,
			index: Number
		},
		members: [
			{
				residenceType: String,
				bookingid: {type: Schema.ObjectId},
				member: {type: Schema.ObjectId, ref: 'Member'}
			}
		],
		rooms: [
			{
				residenceType: String,
				bookingid: {type: Schema.ObjectId},
				room: {type: Schema.ObjectId, ref: 'Room'},
				member: {type: Schema.ObjectId, ref: 'Member'}
			}
		]
	}, {collection: 'residenceSchedule'})
			.plugin(deepPopulate, {}),
	Role: new Schema({
		name: String,
		permissions: [String]
	}, {collection: 'roles'}),
	Permission: new Schema({
		name: String,
		label: String,
		action: String,
		context: String
	}, {collection: 'permissions'}),
	Link: new Schema({
		label: String,
		url: String
	}, {collection: 'links'})

};

exports.mgSchema = mgSchema;