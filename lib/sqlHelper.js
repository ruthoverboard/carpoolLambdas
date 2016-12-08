var aws = require ('aws-sdk');
var connection = require('tedious').Connection;
var Request = require('tedious').Request;
var rows = [];
var sql = require('mssql');
var FCM = require('fcm-node');

module.exports.createUser = function(event, callback){
    console.log(event);
    var id = event.id;
    console.log(id);
    var name = event.name;
    console.log(name);
    var career = event.career;
    var email = event.email;
    var phoneNumber = event.phoneNumber;

    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC createUser " + id + ", '" + name + "', '" + career + "', '" + email + "', '" + phoneNumber + "'", function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
            }
            conn.close();
        });
    });
};

module.exports.searchUser = function(event, cb){
   var id = event.id;
    var results = [];
    console.log(id);

    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
       if(err){
           console.log(err);
           return;
       }
       req.query("EXEC searchUser " + id, function(err, data){
          if(err){
              console.log(err);
          }
          else{
              console.log(data);
              cb(null, data);
          }
          conn.close();
       });
    });
};

module.exports.findRiders = function(event, cb){
    var id = event.id;
    var results = [];
    var close = false;
    console.log(id);

    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);


    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC findRiders " + id, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                cb(null, data);
            }
            conn.close();
        });
    });
};

module.exports.deleteFromQueue = function(event, cb){
    var id = event.id;
    console.log(id);
    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC deleteFromQueue " + id, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                cb(null, data);
            }
            conn.close();
        });
    });
};

module.exports.tripDetail = function(event, cb){
    var data= new Buffer(event.Records[0].kinesis.data, 'Base64').toString();
    console.log(data);
    var split = {}
    split = data.split(',');

    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC insertTripDetail " + split[0] +" , "+ split[1] +" , "+ split[3] + " , "+ split[2], function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
            }
            conn.close();
        });
    });
    console.log(split[4]);
    var serverKey = 'AAAAMCqUqOw:APA91bEJQhdQXw3-IZWHJjTpptFkaXK9Xgre2q4hJU_cl_yzjN5YzbItM_HkWzhlYl15EMGL3nboz1jOHutS2vNo1-b5-GL_rP9iWwdmj4VR_RVsZ9BzDf8lfnnwkUy-o-CtxqTDger-lyjY7I7BYhnFnW4PMA4NtA';
    var fcm= new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: split[4],

        notification: {
            title: 'location',
            body: 'Body of your push notification'
        },

        data: {  //you can send only notification or only data(or include both)
            latitude: split[3],
            longitude:split[2]
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
            console.log(message)
        }
    });


};

module.exports.queueUp = function(event, callback){
    var id = event.id;
    var lat = event.lat;
    var lon = event.lon;
    var idFirebase = event.idFirebase;

    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC queueUp " + id + ", " + lat + ", " + lon + ", '" + idFirebase + "'", function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
            }
            conn.close();
        });
    });
};

module.exports.createTrip = function(event,callback){
    var idUser = event.idUser;
    var startLon = event.startLon;
    var startLat = event.startLat;


    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC createTrip " + idUser + ", " + startLon + ", " + startLat, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                callback(null,data);
            }
            conn.close();
        });
    });
};

module.exports.sendNotification = function(event, cb){
    var nameUser = event.nameUser;
    var idFirebase = event.idFirebase;

    var serverKey = 'AAAAMCqUqOw:APA91bEJQhdQXw3-IZWHJjTpptFkaXK9Xgre2q4hJU_cl_yzjN5YzbItM_HkWzhlYl15EMGL3nboz1jOHutS2vNo1-b5-GL_rP9iWwdmj4VR_RVsZ9BzDf8lfnnwkUy-o-CtxqTDger-lyjY7I7BYhnFnW4PMA4NtA';
    var fcm= new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: idFirebase ,

        notification: {
            title: nameUser + ' te va a dar raite.',
            body: 'Esta dispuesto a llevarte a CETYS Universidad.'
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
            console.log(message)
        }
    });


};

module.exports.getRoute = function(event,cb){
    var idTrip = event.id;

    var config = {
        server: '****.us-east-1.rds.amazonaws.com',
        database: 'prjctLemon',
        user: 'admin',
        password: '****'
    };
    var conn = new sql.Connection(config);

    var req = new sql.Request(conn);

    conn.connect(function(err){
        if(err){
            console.log(err);
            return;
        }
        req.query("EXEC getRoute " + idTrip, function(err, data){
            if(err){
                console.log(err);
            }
            else{
                console.log(data);
                cb(null,data);
            }
            conn.close();
        });
    });
};

