var AddressModel = require('../../models/user/address');
var dtime = require('time-formater');
var uuid = require('uuid/v4');

class Address {
	async getAddress(req, res, next) {
		var userInfo = req.cookies.userInfo;
		try {
			if(!userInfo || !JSON.parse(userInfo).user_id) {
				throw new Error('user_id参数错误');
			}
		} catch(err) {
			res.send({
				code: -1,
				msg: err.message,
				data: null
			})
			return;
		}
		try {
			const addressList = await AddressModel.find({
				user_id: JSON.parse(userInfo).user_id
			});
			res.send({
				code: 0,
				msg: null,
				data: addressList
			})
		} catch(err) {
			console.log('获取收获地址失败', err);
			res.send({
				code: -1,
				msg: '获取地址列表失败',
				data: []
			})
		}
	}
	async getAddAddressById(req, res, next) {
		var address_id = req.body.address_id;
		if(!address_id) {
			res.send({
				code: -1,
				msg: '参数错误',
				data: null
			})
			return
		}
		try {
			const address = await AddressModel.findOne({
				id: address_id
			});
			res.send({
				code: 0,
				msg: '获取地址信息成功',
				data: address
			})
		} catch(err) {
			res.send({
				code: -1,
				msg: '获取地址信息失败',
				data: address
			})
		}
	}
	async addAddress(req, res, next) {
		var name = req.body.name;
var phone = req.body.phone;
var address = req.body.address;
var details = req.body.details;
		var userInfo = req.cookies.userInfo;
		try {
			if(!userInfo || !JSON.parse(userInfo).user_id) {
				throw new Error('user_id参数错误');
			} else if(!name) {
				throw new Error('姓名不可为空');
			} else if(!phone) {
				throw new Error('手机号不可为空');
			} else if(!address) {
				throw new Error('地址不可为空');
			}
		} catch(err) {
			res.send({
				code: -1,
				msg: err.message,
				data: null
			})
			return;
		}
		try {
			const newAddress = {
				id: uuid(),
				user_id: JSON.parse(userInfo).user_id,
				name,
				phone,
				address,
				details,
				created_at: dtime().format('YYYY-MM-DD HH:mm:ss'),
			}
			await AddressModel.create(newAddress);
			res.send({
				code: 0,
				msg: '添加地址成功',
				data: null
			})
		} catch(err) {
			console.log('添加地址失败', err);
			res.send({
				code: -1,
				msg: '添加地址失败',
				data: null
			})
		}
	}
	async deleteAddress(req, res, next) {
		var address_id = req.query.address_id;
		//		console.log(req.query('address_id'))
		var userInfo = req.cookies.userInfo;
		try {
			if(!userInfo || !JSON.parse(userInfo).user_id) {
				throw new Error('user_id参数错误');
			} else if(!address_id) {
				throw new Error('address_id参数错误');
			}
		} catch(err) {
			res.send({
				code: -1,
				msg: err.message,
				data: null
			})
			return;
		}
		try {
			await AddressModel.findOneAndRemove({
				id: address_id
			});
			res.send({
				code: 0,
				msg: '删除地址成功',
				data: null
			})
		} catch(err) {
			res.send({
				code: -1,
				msg: '删除收获地址失败',
				data: null
			})
		}
	}
}

module.exports = new Address();
