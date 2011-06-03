var bodiesNum = 3;
var world;

var xport = 2003;

var syncTime = 1000 / 1;

var	b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2AABB = Box2D.Collision.b2AABB,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2Body = Box2D.Dynamics.b2Body,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Fixture = Box2D.Dynamics.b2Fixture,
	b2World = Box2D.Dynamics.b2World,
	b2MassData = Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;

function setupWorld() {
	world = new b2World(new b2Vec2(0, 10), true);

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.0;
	fixDef.friction = 0.5;
	fixDef.restitution = 0.2;
		 
	var bodyDef = new b2BodyDef;
		 
	// create ground
	bodyDef.type = b2Body.b2_staticBody;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(20, 2);

	bodyDef.position.Set(10, 400 / 30 + 1.8);

	world.CreateBody(bodyDef).CreateFixture(fixDef);
	bodyDef.position.Set(10, -1.8);

	world.CreateBody(bodyDef).CreateFixture(fixDef);
	fixDef.shape.SetAsBox(2, 14);

	bodyDef.position.Set(-1.8, 13);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	bodyDef.position.Set(21.8, 13);
	world.CreateBody(bodyDef).CreateFixture(fixDef);

	// create some objects
	bodyDef.type = b2Body.b2_dynamicBody;

	for(var i = 0; i < bodiesNum; i++) {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(0.5, 0.5);

		bodyDef.position.x = (i + 1) * 4;
		bodyDef.position.y = 3;

		bodyDef.userData = {"bodyId" : parseInt(i) };

		world.CreateBody(bodyDef).CreateFixture(fixDef);	
	}
}

var joints = {};

function getJointData(j) {
	var data = {};

	data.x = j.GetTarget().x;
	data.y = j.GetTarget().y;

	data.bodyId = j.GetBodyB().GetUserData().bodyId;

	return data;
}

function findBody(index) {
	var body = null;

	var nextBody = world.GetBodyList();
	for (var i = 0; i < bodiesNum; i++) {
		if (nextBody.GetUserData().bodyId == index) { body = nextBody; break; }
		nextBody = nextBody.GetNext();
	}

	return body;
}

function createMouseJoint(data) {
	var j = createJoint(world.GetGroundBody(), findBody(data.bodyId), data.x, data.y);
	return j;
}

function createJoint(bodyA, bodyB, x, y) {
	bodyB.SetAwake(true);

	var md = new b2MouseJointDef();
	md.bodyA = bodyA;
	md.bodyB = bodyB;
	md.target.Set(x, y);
	md.collideConnected = true;
	md.maxForce = 300.0 * bodyB.GetMass();
	var j = world.CreateJoint(md);

	return j;
}

function deleteJoint(j) {
	world.DestroyJoint(joints[j]);
	delete joints[j];
}

function updateJoints(data) {
	if (!joints.hasOwnProperty(data.id)) {
		joints[data.id] = createMouseJoint(data);		
	}

	joints[data.id].SetTarget(new b2Vec2(data.x, data.y));
}
