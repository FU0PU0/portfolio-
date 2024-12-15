import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 創建 Canvas
const canvas = document.getElementById("gradientCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 儲存光暈數據
let lightTrail = [];

// 調整畫布大小
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 動態改變背景漸層
document.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const xRatio = clientX / width;
    const yRatio = clientY / height;

    // 灰色调因子
    const grayFactor = 0.4; 

    // 动态计算灰色调颜色
    const color1 = `rgb(${Math.floor(xRatio * 100 * grayFactor + 120)}, ${Math.floor(yRatio * 250 * grayFactor + 120)}, ${Math.floor(150 * grayFactor + 120)})`;
    const color2 = `rgb(${Math.floor(yRatio * 100 * grayFactor + 120)}, ${Math.floor(xRatio * 150 * grayFactor + 120)}, ${Math.floor(250 * grayFactor + 120)})`;
    // 設定漸層角度
    const angle = Math.floor(xRatio * 360);

    // 更新背景
    document.querySelector(".background").style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
});

// 繪製光暈效果
document.addEventListener("mousemove", (event) => {
    lightTrail.push({
        x: event.clientX,
        y: event.clientY,
        radius: 60,
        alpha: 1
    });

    // 限制光暈軌跡數量
    if (lightTrail.length > 20) {
        lightTrail.shift();
    }
});

function drawLight() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < lightTrail.length; i++) {
        const light = lightTrail[i];
        const gradient = ctx.createRadialGradient(
            light.x, light.y, 0,
            light.x, light.y, light.radius
        );

        // 定義漸層顏色
        gradient.addColorStop(0, `rgba(102, 153, 255, ${light.alpha})`);
        gradient.addColorStop(0.5, `rgba(128, 255, 212, ${light.alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();

        light.alpha -= 0.02;
        light.radius += 1;
    }

    lightTrail = lightTrail.filter(light => light.alpha > 0);
}

function render() {
    drawLight();
    requestAnimationFrame(render);
}
render();

// 初始化 Three.js
const modelContainer = document.getElementById("3d-model");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
modelContainer.appendChild(renderer.domElement);

// 添加环境光和方向光
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);

// 加载 GLTF 模型
const gltfLoader = new GLTFLoader();
let cloudModel;

gltfLoader.load(
    'model/cloud.glb',
    (gltf) => {
        console.log("Model loaded successfully!");
        cloudModel = gltf.scene;

        // 创建包围盒并计算模型中心
        const box = new THREE.Box3().setFromObject(cloudModel);
        const center = new THREE.Vector3();
        box.getCenter(center);

        // 将模型平移到几何中心
        cloudModel.position.sub(center);

        // 创建一个组将模型包裹起来，用于旋转
        const modelGroup = new THREE.Group();
        modelGroup.add(cloudModel);

        // 添加到场景中
        scene.add(modelGroup);

        // 更新 cloudModel 为旋转的组
        cloudModel = modelGroup;

        animate(); // 模型加载完成后开始动画
    },
    undefined,
    (error) => {
        console.error("Error loading model:", error);
    }
);

// 设置相机位置
camera.position.z = 10; // 将相机拉远，确保模型可见

// 渲染和旋转动画
function animate() {
    requestAnimationFrame(animate);
    if (cloudModel) {
        cloudModel.rotation.y += 0.01; // 缓慢旋转
    }
    renderer.render(scene, camera);
}

const boxContents = [
    { title: "Lost & Found", content: `My partner is Emily. She told me that she had lost her puppy doll and described its color to me. I first thought about what kind of puppy I wanted to make and how its movements would be, and then I tried to use the functions I had learned in class to present it. This was harder than I thought because I had only learned how to use basic geometric shapes like squares, ellipses, and triangles. So at first the puppy's shape was very strange, so I tried to use simple geometric shapes to form the image of a puppy. For the different parts of the puppy, I used a lot of fill and noStroke functions to fill in the colors and make them outline-free. I also used push and pop to control the transformation of some of the shapes. For the background, I learned from tutorials on the internet how to create a gradient effect, i.e. how to use line, lerpColor and map, as well as for to create a loop. I think the most difficult part is rotating my graphics, and I'm still not sure how to do it right, because I feel like I'm still using a very basic method, which is to slowly adjust my values and see if it's the effect I want. But I hope that with practice I will be able to figure out more quickly how to use functions to create the effect I want.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/3H0VCubsP" },
    { title: "Face Generator", content: `For this assignment, I first decided to create a frog's face and drew a sketch on the computer using Adobe Illustrator. In p5.js, I used lines and ellipses to create the frog's face. In order to make its face, eyes and mouth deform as the mouse moves, I used map to convert the x and y changes of the mouse into a range and import them into line and ellipse. I used if and else to make the background change color when I click on the screen with my mouse. The hardest part was the rain effect that appears when the mouse clicks on the screen, which I learned from the internet. I set the x and y of the raindrops and the speed, added newDrop to the array raindrops, then used for to create a loop, and finally set the raindrops to be removed from the array raindrops if they exceed the bottom of the screen. I spent a lot of time on this assignment adjusting the shape that can be deformed with the movement of the mouse. In addition, I also found in the process that often what I thought was possible in the program would not actually produce the effect I wanted, and then I would need to change the order or use other functions.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/cRUr1RjBj" },
    { title: "Experimental Clock", content: `I want to express my missing of my family and friends in Taiwan through the experimental clock. I transformed my missing into the little balls in the background, which will accumulate on the screen little by little as time goes by. And at this time, I just need to give them a call and I will feel better. So I made a button, and as long as I press the button, the little balls in the background will disappear, and when I let go, the balls will continue to accumulate slowly. The two rectangular shapes in the middle represent the fact that I live a day-night reversal with the important people I have in Taiwan. When New York is day, Taipei is night. Every time I want to call, I have to make sure it's not when they're sleeping or in class or at work. So I used gradient colors to create rectangles for day and night. They slowly change from day to night to day, representing the passing of each day. But the two rectangles are opposite, representing the time difference between Taipei and New York. When I move the mouse over the two rectangles, the real-time local time is displayed, which helps me to check the time whenever I make a phone call. When sketching, I spent a lot of time thinking about what would be a good object in the middle of the screen. I originally thought about a phone, but I felt that it would distract from my subject. Then I thought about how today when we make a phone call, we press the call button on the screen, so I thought about making an actual button. I think the most difficult part was creating the background ball. I continued to use the method I learned in my previous assignment of making objects fall, but this time let them accumulate at the bottom of the screen. I feel like I learn more every time I do an assignment, and I'm starting to gradually understand how I can apply it, but I really find the production process difficult and painful.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/_D7dIlkaK" },
    { title: "Exquisite Corpse", content: `Partner:
Isabel, Drinomino, Emily
<br><br>
Backstory:
The creature I drew is an adventurous but a little shy bat. It likes to wear its favorite purple rain boots on rainy days because that's when it feels most comfortable. The sound and feel of rain relaxes it and gives it the courage to explore the outside world. Even on sunny days, he always wears his raincoat and boots, as he feels they are essential equipment for exploring.
<br><br>
My team and I communicate via Discord. We thought of making a piece where the parts of the creatures we draw change randomly when the mouse is clicked. Isabel and Drinomino first sent me their image files, but their pictures could not be displayed correctly. Then I modified some code and they appeared successfully. However, as we added our photos later, many problems arose again. I later found that the method of using [] and push can achieve the effect we want. I originally used p5.js to create my creature directly, but after discussing with Isabel, I redrew a creature to match the overall appearance. I found this project very interesting and could discuss with the class about how to do it. But I think the most difficult part was that everyone couldn't meet and discuss during the production process. Then this was the first time I imported pictures in p5.js. I learned how to randomly transform many pictures in the process.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/LmZUrg5bd" },
    { title: "Optical Illusion", content: `I take English classes every Thursday at The New School in a Lang building, and there is a Bridget Riley work called Fragment 4 on the fifth floor where I take my classes, which inspired this assignment. Bridget Riley arranged many zeros in a neat line, but if you look closely, you will see that the shapes of these zeros are a bit different, which gives the work a sense of movement. I thought this piece of work was quite interesting, so I tried to play around with what effect the zero could have in my assignment. Then I made a slider that could adjust the width of a column of rectangles from left to right, so when people adjusted the slider, the zeroes would have a different visual effect.
<br><br>
I think the difficult part of this assignment was that I didn't know what to do to make it an optical illusion, so I tried a lot and made many different versions, but I ended up liking the one I submitted the best.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/5SrHLK2dQ" },
    { title: "Data Portrait", content:`In my Data Portrait I try to track how many times I check my calendar in a day and why. Since starting my life at this school, I've realized that the calendar inside my phone doesn't help to remind me of all my assignments and various things in an efficient manner. So I downloaded an app on my phone to organize my schedule. Since the beginning of the school year I've become very accustomed to checking the app every day, and I've found that I check it often for several reasons, so I've chosen to track and document my behavior. In my sketch, the five different colored balls in the top row are the reasons why I check my calendar, and the table below shows the seven days and each day from 7:00 to 10:00 p.m., as well as the fact that you can see how often I keep opening my app. The graphic in the middle is my attempt to make a visual image out of the colors representing the different reasons, as I wanted to put together a picture of my boring and dull life. In my design process, I started by figuring out how I wanted to categorize the five reasons for viewing the calendar, so I first made five balls and a table in which the different colors and sizes of the balls were arranged in seven rows. I then made the main character of my screen, the center graphic, I found that I was using too many circles so I switched to lines. After going through the self-tracking process, I realized that I am now really craving a slightly longer vacation where I can take a break, but all in all it was really fun to visualize a certain kind of information and I hope that I will be able to design better looking works in the future.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/1AKJ2ZoCJ" },
    { title: "Autobiographical Game", content: `I want to make a mini-game based on my current life. I do homework every day, including holidays, and I feel really tired after a few months. So I want to make a mini-game about my daily life, but add more relaxing elements. I'm interested in pixel art and have always wanted to try it, so I plan to use a pixel style throughout the game. 
<br><br>
I plan to make the main character a kitten. In the beginning of the game, the player will be in front of a mirror, but the image in the mirror will be blurry because it is all mosaic. After the player wipes it, they will only be able to see a little of the main character's image, because this is a dream. As the player rubs the mirror more and more, the canvas becomes covered with more and more mosaic, and then enters the content of the dream. At this time, the player controls the cloud to protect the text in the picture, which is the Japanese meaning of “ah”. However, as more and more stars fall, the “ah” will become bigger and bigger, just like a sudden awakening. Then the screen will switch to a scene of the kitten in a space studio. The player will then receive instructions to take the kitten back to Earth. After returning to the kitten's room, the player can use the keyboard to move the kitten. The kitten may be hungry, so the player can also take it outside the room to the next scene to find food. However, the ultimate goal of the game is to help the kitten make the right choices so that it can complete the task before the deadline.
<br><br>
This was the first time I made a game, and I encountered a lot of difficulties, such as not knowing how to design game levels and not being able to achieve the effects I wanted. In addition, I decided to set the game canvas to 600*600 because I wanted to give the game a cuter and more retro design. But overall, this experience was very interesting and has made me want to continue learning how to make more interesting games in the future. I hope to try to make more abstract but aesthetically pleasing works after this.`, sketchPage: "https://editor.p5js.org/FU0PU0/full/ZmMgWosCm" }
];

let isPanelActive = false;
let boxesCreated = false;
let introShown = false;

const personalIntro = `
    <div class="panel-content-container">
        <h2 class="panel-title">About Me</h2>
        <p class="panel-text">
            Hi, there! I am a sophomore student in Parsons School Of Design<br><br>
            I'm from Taiwan and my English isn't very good. I have only been in New York for a few months, and I'm still getting used to everything. School life can be exhausting in many ways, but learning various technologies in the DT program makes me feel truly fulfilled!
        </p>
    </div>
`;

// 点击事件处理
document.addEventListener('click', () => {
    if (cloudModel) {
        const targetScale = 0.5;
        const targetPosition = { x: -6.5, y: -4.2, z: 0 };
        const animationDuration = 1000;
        const startTime = performance.now();

        const initialScale = cloudModel.scale.x;
        const initialPosition = { x: cloudModel.position.x, y: cloudModel.position.y, z: cloudModel.position.z };

        function animateMove(time) {
            const elapsedTime = time - startTime;
            const t = Math.min(elapsedTime / animationDuration, 1);
            const easeT = easeInOutQuad(t);

            const scale = initialScale + (targetScale - initialScale) * easeT;
            cloudModel.scale.set(scale, scale, scale);

            const x = initialPosition.x + (targetPosition.x - initialPosition.x) * easeT;
            const y = initialPosition.y + (targetPosition.y - initialPosition.y) * easeT;
            const z = initialPosition.z + (targetPosition.z - initialPosition.z) * easeT;
            cloudModel.position.set(x, y, z);

            if (t < 1) {
                requestAnimationFrame(animateMove);
            }
        }
        requestAnimationFrame(animateMove);
    }

    const rightPanel = document.querySelector('.right-panel');
    rightPanel.classList.add('active');

    const roundedBoxContainer = document.querySelector('.rounded-box-container');
// 新增判斷：如果還沒顯示介紹，就先顯示介紹文字後return
if (!introShown) {
    rightPanel.innerHTML = personalIntro;
    introShown = true;
    return; // 終止此函式，不繼續執行產生匡的程式碼
}

    // 只在第一次點擊時產生圓匡
    if (roundedBoxContainer && !boxesCreated) {
        roundedBoxContainer.style.display = "flex";
        roundedBoxContainer.innerHTML = "";

        // 設定 boxesCreated，避免重複產生匡
        boxesCreated = true;

        boxContents.forEach((boxContent, i) => {
            const box = document.createElement("div");
            box.classList.add("rounded-box");
            box.textContent = boxContent.title;
            box.style.transitionDelay = `${i * 0.2}s`;

            box.addEventListener("mouseenter", () => {
                box.style.backgroundColor = "white";
                box.style.color = "black";
            });

            box.addEventListener("mouseleave", () => {
                box.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                box.style.color = "white";
            });

            box.addEventListener("click", () => {
                // 已有這行使面板滑出
                rightPanel.classList.add("active");
        
                // 在面板滑出後設定 p5.js 作品內容
                rightPanel.innerHTML = `
                <div class="panel-content-container">
                    <h2 class="panel-title">${boxContent.title}</h2>
                    <div class="panel-iframe-container">
                        <iframe src="${boxContent.sketchPage}"></iframe>
                    </div>
                    <p class="panel-text">${boxContent.content}</p>
                </div>
            `;
            });

            roundedBoxContainer.appendChild(box);

            requestAnimationFrame(() => {
                box.style.opacity = 1;
                box.style.transform = "translateY(0)";
            });
        });
    }
});

// 缓动函数（Ease In-Out）
function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// 双击事件：清除圆角框并恢复模型位置
document.addEventListener('dblclick', () => {
    const roundedBoxContainer = document.querySelector('.rounded-box-container');

    if (roundedBoxContainer) {
        const boxes = roundedBoxContainer.querySelectorAll(".rounded-box");
        boxes.forEach((box, i) => {
            setTimeout(() => {
                box.style.opacity = 0;
                box.style.transform = "translateY(-20px)"; // 向上平滑隐藏
            }, i * 200); // 为每个框添加延迟
        });
    
        setTimeout(() => {
            roundedBoxContainer.innerHTML = ""; // 清空内容以确保立即生效
            roundedBoxContainer.style.display = "none";
        }, boxes.length * 200); // 确保所有框隐藏后再清空内容
    }

    if (cloudModel) {
        const targetScale = 1;
        const targetPosition = { x: 0, y: 0, z: 0 };
        const animationDuration = 1000;
        const startTime = performance.now();

        const initialScale = cloudModel.scale.x;
        const initialPosition = { x: cloudModel.position.x, y: cloudModel.position.y, z: cloudModel.position.z };

        function animateReset(time) {
            const elapsedTime = time - startTime;
            const t = Math.min(elapsedTime / animationDuration, 1);
            const easeT = easeInOutQuad(t);

            const scale = initialScale + (targetScale - initialScale) * easeT;
            cloudModel.scale.set(scale, scale, scale);

            const x = initialPosition.x + (targetPosition.x - initialPosition.x) * easeT;
            const y = initialPosition.y + (targetPosition.y - initialPosition.y) * easeT;
            const z = initialPosition.z + (targetPosition.z - initialPosition.z) * easeT;
            cloudModel.position.set(x, y, z);

            if (t < 1) {
                requestAnimationFrame(animateReset);
            }
        }
        requestAnimationFrame(animateReset);
    }

    const rightPanel = document.querySelector('.right-panel');
    rightPanel.classList.remove('active');
});