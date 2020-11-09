const db = require("./db")

module.exports ={
createTable: ()=>{
    db.query("create table users (id char(30), name char(30), room char(30),avatar_url varchar(200), primary key (id)) ", err=>{
        if(err) throw err
    })
},
tableExists: (callback)=>{
    db.query("show tables in chatappp", ((err, result)=>{
        callback(err,result)
    })
    )}
    ,
   

    addUser: (socketid, username, room, avatarUrl)=>{
        
        db.query("insert into users (id, name, room, avatar_url) values (?,?,?,?)", [socketid, username, room, avatarUrl], err=>{
            if(err) throw err
          
        
     }) },

    findUser: (socketid=> db.query("select * from users where id = ?", [socketid])
        )
}  


