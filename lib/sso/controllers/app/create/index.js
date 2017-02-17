// curl 'http://localhost:10307/act'  -H 'Content-Type: application/json' --data-binary '{"cmd": "create", "ctrl":"app", "role":"cd-sso", "app": {"name":"aaaa123", "url":"sqdqsd", "callbackUrl":"http://localhost:3002/auth/example-oauth2orize/callback", "tosUrl":"qsd", "iconUrl":"http://www.namiscorporate.com/images/D3.png", "privacyUrl":"qsd", "secretKey":"secret", "fields":["profile"]}, "user":{"id":23}}'
module.exports = function () {
  var ctx = this.context;
  return function (args, cb) {
    var acts = this.export('cd-sso/acts')[args.ctrl];
    var app = args.app;
    app.creatorId = args.user.id;
    app.transparent = ctx.TRANSPARENT;
    app.tosUrl = app.TOS_url;
    app.createdAt = new Date();
    acts.save({app: app})
    .asCallback(cb, {spread: true});
  };
};
