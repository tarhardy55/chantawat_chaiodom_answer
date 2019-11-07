/*
 * Custom code goes here.
 */
var isSignIn = window.localStorage.getItem('emailForSignIn');
const login = new Vue({
	el:"#login-form",
	data:{
		errors: [],
		email:null,
		password:null,
		isSignIn:null,
		userAuth:[]
	},
	methods:{
		getULogin(s){
			this.errors = [];
			var LoError = [];

			if (!this.email) {
				this.errors.push("Email required.");
			}

			if (!this.password) {
				this.errors.push("Password required.");
			}

			if (!this.validEmail(this.email)) {
				this.errors.push('Valid email required.');
			}

			if (!this.errors.length) {
				//window.localStorage.setItem('emailForSignIn', this.email);
				//console.log(window.localStorage.getItem('emailForSignIn'));
				firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(function(user){
				  	window.localStorage.setItem('emailForSignIn', user.user.email);
				  	location.reload();
				}).catch(function(error) {
					//console.log(error);
					LoError.push(error.code);
					LoError.push(error.message);
				});
				this.errors = LoError;
			}
			s.preventDefault();
		},
		validEmail: function (email) {
	      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	      return re.test(email);
	    }
	},
	created(){
		this.isSignIn = isSignIn;
	}
});

const db=firebase.firestore();
const app = new Vue({
	el:"#user-form",
	data:{
		errors: [],
		isSignIn:null,
		dockey:null,
		userid:null,
		username:null,
		newpassword:null,
		password:null,
		fname:null,
		lname:null,
		age:null,
		tel:null,
		address:null,
		userdataS:[]
	},
	methods:{
		SaveUserData:function(s){
			this.errors = [];
			if (!this.username) {
				this.errors.push('Username required.');
			}
			if (!this.fname) {
				this.errors.push('First name required.');
			}
			if (!this.lname) {
				this.errors.push('Last name required.');
			}
			if (!this.address) {
				this.errors.push('address required.');
			}
			if (!$.isNumeric(this.age)) {
				this.errors.push('Age not number.');
			}
			if (!$.isNumeric(this.tel)) {
				this.errors.push('Phone not number.');
			}
			if(this.dockey == null){
				if (!this.newpassword || this.newpassword.length < 5) {
					this.errors.push('Password required or At least 5 characters long.');
				}else{
					this.password = this.newpassword;
				}
			}else if(this.dockey){
				if(this.newpassword){
					if(this.newpassword.length < 5){
						this.errors.push('New Password at least 5 characters long.');
					}else{
						this.password = this.newpassword;
					}
					
				}
			}
			
			if (!this.errors.length) {
				if(this.dockey == null){
					this.userid = parseInt((new Date().getTime() / 100).toFixed(0));
					db.collection('userXDataBase').add({
						userid:this.userid,
						username:this.username,
						password:$.md5(this.password),
						fname:this.fname,
						lname:this.lname,
						age:this.age,
						tel:this.tel,
						address:this.address
					}).then(function() {
					    location.reload();
					}).catch(function(error) {
					    console.error("Error removing document: ", error);
					});

				}else if(this.dockey){
					db.collection('userXDataBase').doc(this.dockey).update({
						userid:this.userid,
						username:this.username,
						password:$.md5(this.password),
						fname:this.fname,
						lname:this.lname,
						age:this.age,
						tel:this.tel,
						address:this.address
					}).then(function() {
					    location.reload();
					}).catch(function(error) {
					    console.error("Error removing document: ", error);
					});
				}
				
			}
			s.preventDefault();
		},
		editUser:function(useritem){
			this.userid = useritem.userid;
			this.username = useritem.username;
			this.newpassword = null;
			this.password = useritem.password;
			this.fname = useritem.fname;
			this.lname = useritem.lname;
			this.age = useritem.age;
			this.tel = useritem.tel;
			this.type = useritem.type;
			this.address = useritem.address;
			this.dockey = useritem.dockey;
		},
		delUser:function(useritem){
			db.collection('userXDataBase').doc(useritem.dockey).delete().then(function() {
			    location.reload();
			}).catch(function(error) {
			    console.error("Error removing document: ", error);
			});
			
		},
		getULogout(o){
	    	window.localStorage.removeItem('emailForSignIn');
	    	location.reload();
	    	o.preventDefault();
	    }
	},
	created(){
		this.isSignIn = isSignIn;
		//console.log(window.localStorage.getItem('emailForSignIn'));
		db.collection('userXDataBase').get().then((snapshot)=>{
			snapshot.forEach(doc=>{
				var uds = doc.data();
				uds['dockey'] = doc.id;
				this.userdataS.push(uds);
			});
		});
	}
});