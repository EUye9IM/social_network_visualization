const cfg = {
	cvs: {
		w: 800,
		h: 840
	},
	initCvsT: {
		sc: 1,
		dx: 400,
		dy: 420
	},
	draw: {
		rootSize: 60,
		attrLineLen: { min: 200, gap: 20 },
		attrSize: {
			w: 200,
			h: 40
		},
		nameLineLen: { min: 160, gap: 100 },
		nameSize: 40,
		linew: 1
	}
};
$(function () {
	var fileData;
	var ctx;
	var cvsT;
	var person;
	var drawData;
	init();
	function init() {
		changeLeftPerson(null);
		$("#canvas").attr("width", cfg.cvs.w);
		$("#canvas").attr("height", cfg.cvs.h);
		ctx = $("#canvas")[0].getContext("2d");
		cvsT = Object.assign({}, cfg.initCvsT);
	}
	function strcmp(item1, item2) {
		return item1.localeCompare(item2);
	}
	function rside() {
		if (person == null) {
			$("#rightSide").hide();
			changeRightPerson(null)
			return;
		}
		var friList;
		for (i in fileData) {
			if (fileData[i]['name'] == person) {
				friList = fileData[i]['friend'];
				break;
			}
		}
		$("#friTb").empty();
		$("#rightSide").show();
		var fri = new Set();
		for (i in drawData) {
			for (k in drawData[i][1]) {//每个疑似好友
				var cnt = 0;
				for (j in fileData)
					if (fileData[j]['name'] == drawData[i][1][k]) {
						for (x in fileData[j]['friend'])
							if ($.inArray(fileData[j]['friend'][x], friList) != -1)
								cnt++;
						break;
					}
				fri.add([drawData[i][1][k], cnt]);
			}
		}
		var l = Array.from(fri).sort(function (a, b) {
			if (a[1] < b[1])
				return 1;
			if (a[1] > b[1])
				return -1;
			return 0;
		})
		for (i in l) {
			var newItem = $('<tr data="' + l[i][0] + '"><td>' + l[i][0] + "</td><td>" + l[i][1] + "</td></tr>");
			newItem.on("click", function () {
				changeRightPerson(this.getAttribute('data'));
			})
			$("#friTb").append(newItem);
		}

	}
	function changeRightPerson(rPerson) {
		if (rPerson == null) {
			$("#rPersonInfo").hide();
			return;
		}
		$("#rName").text(rPerson);
		var friList;
		for (i in fileData) {
			if (fileData[i]['name'] == person) {
				friList = fileData[i]['friend'];
				for (j in fileData) {
					if (fileData[j]['name'] == rPerson) {
						var x = fileData[j];
						var firList2 = x['friend']
							.sort(function (a, b) { return strcmp(a, b); });;
						var attrList = x['attribute'];
						$("#rFri").empty();
						$("#rAttr").empty();
						for (i in firList2) {
							var newItem = $("<span>");
							newItem.text(firList2[i]);
							if ($.inArray(firList2[i], friList) != -1)
								newItem.attr("class", "rlistItem selected");
							else
								newItem.attr("class", "rlistItem");
							$("#rFri").append(newItem);
						}
						for (i in attrList) {
							var newItem = $("<div>");
							for (key in attrList[i]) {
								newItem.text(key + "=" + attrList[i][key]);
								break;
							}
							$("#rAttr").append(newItem);
						}
						break;
					}
				}
				break;
			}
		}
		$("#rPersonInfo").show();
	}
	function draw() {
		function calR(angel, min, gap, num) {
			var d = gap / angel * num;
			return d > min ? d : min;
		}
		if (person == null) {
			$("#canvas").hide();
			return;
		}
		$("#canvas").show();
		//clear
		$("#canvas")[0].height = $("#canvas")[0].height;
		ctx.setTransform(cvsT.sc, 0, 0, cvsT.sc, cvsT.dx, cvsT.dy);
		//attr
		var n = drawData.length;
		var l = calR(Math.PI * 2, cfg.draw.attrLineLen.min, cfg.draw.attrLineLen.gap, n);
		for (var j = 0; j < n; j++) {
			var angle = j * Math.PI * 2 / n;
			var x = 0 + l * Math.cos(angle);
			var y = 0 - l * Math.sin(angle);
			//line
			ctx.moveTo(0, 0);
			ctx.lineTo(x, y);
			ctx.stroke();
			var nn = drawData[j][1].length;

			var da = Math.PI * 2 / n / nn;
			var starta = angle - Math.PI / n + da / 2;
			var ll = calR(Math.PI * 2 / n, cfg.draw.nameLineLen.min, cfg.draw.nameLineLen.gap, nn);

			for (k in drawData[j][1]) {
				var xx = x + ll * Math.cos(starta + k * da);
				var yy = y - ll * Math.sin(starta + k * da);
				//line
				ctx.moveTo(x, y);
				ctx.lineTo(xx, yy);
				ctx.stroke();
				//namenode
				ctx.fillStyle = "#000000";
				ctx.beginPath();
				ctx.arc(xx, yy, cfg.draw.nameSize + cfg.draw.linew, 0, 2 * Math.PI);
				ctx.fill();
				ctx.fillStyle = "#F0F0F0";
				ctx.beginPath();
				ctx.arc(xx, yy, cfg.draw.nameSize, 0, 2 * Math.PI);
				ctx.fill();
				ctx.fillStyle = "#000000";
				ctx.font = "20px sans-serif";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillText(drawData[j][1][k], xx, yy, 1.7 * cfg.draw.nameSize);
			}
			//attrnode
			ctx.fillStyle = "#000000";
			ctx.fillRect(x - cfg.draw.attrSize.w / 2 - cfg.draw.linew,
				y - cfg.draw.attrSize.h / 2 - cfg.draw.linew,
				cfg.draw.attrSize.w + 2 * cfg.draw.linew,
				cfg.draw.attrSize.h + 2 * cfg.draw.linew);
			ctx.fillStyle = "#F0F0F0";
			ctx.fillRect(x - cfg.draw.attrSize.w / 2,
				y - cfg.draw.attrSize.h / 2,
				cfg.draw.attrSize.w,
				cfg.draw.attrSize.h);
			ctx.fillStyle = "#000000";
			ctx.font = "20px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(drawData[j][0], x, y, 0.9 * cfg.draw.attrSize.w);
		}
		//root
		ctx.fillStyle = "#000000";
		ctx.beginPath();
		ctx.arc(0, 0, cfg.draw.rootSize + cfg.draw.linew, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "#F0F0F0";
		ctx.beginPath();
		ctx.arc(0, 0, cfg.draw.rootSize, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = "#000000";
		ctx.font = "30px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(person, 0, 0, 1.7 * cfg.draw.rootSize);
	}
	function fleshDrawData() {
		drawData = [];
		for (i in fileData) {
			if (fileData[i]['name'] == person) {
				var x = fileData[i];
				var attrList = x['attribute'];
				var n = attrList.length;
				for (var j = 0; j < n; j++) {
					drawData[j] = [];
					var key, val;
					for (key in attrList[j]) {
						key = key;
						val = attrList[j][key];
						break;
					}
					drawData[j][0] = val;
					drawData[j][1] = [];
					for (k in fileData) {
						if (fileData[k]['name'] == person) {
							continue;
						}
						for (cnt in fileData[k]['attribute']) {
							if (fileData[k]['attribute'][cnt][key] == val) {
								drawData[j][1].push(fileData[k]['name'])
							}
						}
					}
				}
				break;
			}
		}
	}
	function changeLeftPerson(lPerson) {
		changeRightPerson(null);
		cvsT = Object.assign({}, cfg.initCvsT);
		if (lPerson == null) {
			person = null;
			$("#lPersonInfo").hide();
			draw();
			rside();
			return;
		}
		person = lPerson;
		$("#lPersonInfo").show();
		$("#lName").text(lPerson);
		for (i in fileData) {
			if (fileData[i]['name'] == lPerson) {
				var x = fileData[i];
				var firList = x['friend']
					.sort(function (a, b) { return strcmp(a, b); });;
				var attrList = x['attribute'];
				$("#lFri").empty();
				$("#lAttr").empty();
				for (i in firList) {
					var newItem = $("<span>");
					newItem.text(firList[i]);
					newItem.attr("class", "listItem");
					newItem.on("click", function () { changeLeftPerson(this.innerText) });
					$("#lFri").append(newItem);
				}
				for (i in attrList) {
					var newItem = $("<div>");
					for (key in attrList[i]) {
						newItem.text(key + "=" + attrList[i][key]);
						break;
					}
					$("#lAttr").append(newItem);
				}
				break;
			}
		}
		fleshDrawData();
		draw();
		rside();
	}
	$("#file").on("change", function () {
		if (this.value) {
			changeLeftPerson(null);
			var f = this.files[0];
			var fr = new FileReader();
			fr.onload = function (e) {
				var data = e.target.result;
				fileData = (new Function("return " + data))()
					.sort(function (a, b) { return strcmp(a['name'], b['name']); });
				$("#leftNameList").empty();
				for (i in fileData) {
					var newName = $("<span>");
					newName.text(fileData[i]['name']);
					newName.attr("class", "listItem l");
					newName.on("click", function () { changeLeftPerson(this.innerText) });
					$("#leftNameList").append(newName);
				}
			}
			fr.readAsText(f)
		}
	})
	$("#canvas")[0].onwheel = function (e) {
		var x = e.offsetX - cvsT.dx;
		var y = e.offsetY - cvsT.dy;
		var ds = Math.pow(0.995, e.deltaY);
		cvsT.dx -= x * (ds - 1);
		cvsT.dy -= y * (ds - 1);
		cvsT.sc *= ds;
		draw();
	}
	$("#canvas")[0].onmousedown = function (e) {
		var x = cvsT.dx - e.offsetX;
		var y = cvsT.dy - e.offsetY;
		//按下后可移动
		$("#canvas")[0].onmousemove = function (e) {
			cvsT.dx = x + e.offsetX;
			cvsT.dy = y + e.offsetY;
			draw();
		};

		//鼠标抬起清除绑定事件
		$("#canvas")[0].onmouseleave = function () {
			$("#canvas")[0].onmousemove = null;
			$("#canvas")[0].onmouseup = null;
			$("#canvas")[0].onmouseleave = null;
		};
		canvas.onmouseup = function () {
			$("#canvas")[0].onmousemove = null;
			$("#canvas")[0].onmouseup = null;
			$("#canvas")[0].onmouseleave = null;
		};
	};
})