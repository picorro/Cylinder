var center = new THREE.Vector3(15,0,15)
var isShadows = false
var isWireframe = false

var clock
var goal
var camera
var scene
var renderer
var stats
var trackballControls

var r = 3
var h = 6
var pointCount = 500

var startTime = (new Date()).getTime()
Start()
Update()



function Start()
{
    clock = new THREE.Clock()
    
    stats = StartStats()
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.x = 15
    camera.position.y = 10
    camera.position.z = 10
    camera.rotation.x = -Math.PI/2
    renderer = new THREE.WebGLRenderer()
    renderer.setClearColor(0xEEEEEE, 1.0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMapEnabled = isShadows
    var ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight)
    StartControlls()
    CreateCylinder()

    $("#WebGL-output").append(renderer.domElement)
}

function Update() 
{
    stats.update();
    var delta = (new Date()).getTime() - startTime
    trackballControls.update(delta)
    requestAnimationFrame(Update)
    renderer.render(scene, camera)
}

function CreateCylinder()
{
	var goalGeo = new THREE.ConvexGeometry(GenerateCylinderPoints(h, r))
    SetUVs(goalGeo);
    goal = CreateMesh(goalGeo, "checkers.jpg")
    goal.position.set(center.x, center.y, center.z)
    scene.add(goal);
}

function CreateMesh(geometry, imageFile) 
{
    var loader = new THREE.TextureLoader()
    loader.crossOrigin = ''
    var texture = new loader.load(imageFile)
    texture.wrapS = THREE.RepeatWrapping
    return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff, map:texture}))
}

function SetUVs(goalGeo)
{
    for(var i = 0; i < goalGeo.faces.length; i++)
    {
        var a = new THREE.Vector2(
            CountU(goalGeo.vertices[goalGeo.faces[i].a].x, goalGeo.vertices[goalGeo.faces[i].a].z, r), 
            CountV(goalGeo.vertices[goalGeo.faces[i].a].y, h));        
        var b = new THREE.Vector2(
            CountU(goalGeo.vertices[goalGeo.faces[i].b].x, goalGeo.vertices[goalGeo.faces[i].b].z, r), 
            CountV(goalGeo.vertices[goalGeo.faces[i].b].y, h));
        var c = new THREE.Vector2(
            CountU(goalGeo.vertices[goalGeo.faces[i].c].x, goalGeo.vertices[goalGeo.faces[i].c].z, r),
            CountV(goalGeo.vertices[goalGeo.faces[i].c].y, h))
        if(a.x - b.x >= 0.5 && c.x - b.x >= 0.5)
            b.x += 1
        else if(b.x - a.x >= 0.5 && c.x - a.x >= 0.5)
            a.x += 1
        else if(b.x - c.x >= 0.5 && a.x - c.x >= 0.5)
            c.x += 1
        else if(a.x - b.x >= 0.5 && a.x - c.x >= 0.5)
            a.x -= 1
        else if(b.x - c.x >= 0.5 && b.x - a.x >= 0.5)
            b.x -= 1
        else if(c.x - b.x >= 0.5 && c.x - b.x >= 0.5)
            c.x -= 1
        goalGeo.faceVertexUvs[0].push([a, b, c]) 
    }
}

function CountV(y, h)
{
    return (y / h + 0.5)
}

function CountU(x, z, r)
{
    var C = 2 * Math.PI * r
    var alpha = -Math.atan2(z, x)
    alpha = alpha * (180 / Math.PI)
    if(alpha < 0)
    {
        alpha += 360
    }
    var l = (Math.PI * r * alpha) / 180
    return l / C
}

function GenerateCylinderPoints(height, radius)
{
	var points = []
    for(var i = 0; i < pointCount; i++)
	{
        var sign = Math.random() >= 0.5 ? 1 : -1     
        var x = (Math.random() * radius) - radius / 2
        var y = (Math.random() * height) - height / 2
        var z = sign * (Math.random() * Math.sqrt((radius / 2) * (radius / 2) - x * x)) // changed so it is random in volume and not on edge 
        points.push(new THREE.Vector3(x, y, z))
	}
	return points;
}

function StartControlls()
{
	trackballControls = new THREE.TrackballControls(camera)
	trackballControls.target.set( 15, 0, 15)
	trackballControls.rotateSpeed = 10.0
	trackballControls.zoomSpeed = 10.0
	trackballControls.panSpeed = 1.0
	trackballControls.noZoom = false
	trackballControls.noPan = true
	trackballControls.staticMoving = true
	trackballControls.dynamicDampingFactor = 0.1
}

function StartStats() {

    var stats = new Stats()
    stats.setMode(0)
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    $("#Stats-output").append( stats.domElement )
    return stats
}