/* main JS file */

const wikipediaLinks = [
  "Burj_Khalifa",
  "International_Commerce_Centre",
  "KK100",
  "Abraj_Al_Bait",
  "One_World_Trade_Center",
  "Petronas_Towers",
  "Shanghai_World_Financial_Center",
  "Taipei_101",
  "Willis_Tower",
  "Zifeng_Tower"
];

d3.csv("data/buildings.csv", data => {
  console.log("Data loading complete.");
  const buildings = data
    .map((d, index) => {
      return {
        ...d,
        floors: +d.floors,
        height_m: +d.height_m,
        height_ft: +d.height_ft,
        height_px: +d.height_px,
        link: wikipediaLinks[index]
      };
    })
    .sort((a, b) => b.height_m - a.height_m);

  console.log(buildings);
  const svg = d3
    .select("#svg-container")
    .append("svg")
    .attr("width", 500)
    .attr("height", 400);

  const rectangles = svg
    .selectAll("rect")
    .data(buildings)
    .enter()
    .append("rect")
    .attr("y", (building, index) => index * 40)
    .attr("x", 220)
    .attr("width", building => building.height_px)
    .attr("height", 30)
    .attr("fill", "purple")
    .attr("class", "bar");

  rectangles.on("click", building => getDetails(building));

  const labels = svg
    .selectAll("text.label")
    .data(buildings)
    .enter()
    .append("text")
    .attr("y", (building, index) => index * 40 + 20)
    .attr("x", 200)
    .attr("text-anchor", "end")
    .attr("class", "label")
    .text(building => building.building);

  labels.on("click", building => getDetails(building));

  const heights = svg
    .selectAll("text.height")
    .data(buildings)
    .enter()
    .append("text")
    .attr("y", (building, index) => index * 40 + 20)
    .attr("x", building => parseInt(building.height_px) + 200)
    .attr("text-anchor", "middle")
    .attr("class", "height")
    .text(building => building.height_m);

  heights.on("click", building => getDetails(building));

  createBottomLabel();

  getDetails(buildings[0]);
});

function getDetails(building) {
  const imgContainer = document.getElementById("image");
  const detailsContainer = document.getElementById("details");
  imgContainer.innerHTML = "";
  detailsContainer.innerHTML = "";
  const img = document.createElement("img");
  img.setAttribute("class", "building-image");
  img.src = `/img/${building.image}`;
  img.setAttribute("width", 250);
  imgContainer.appendChild(img);

  const title = document.createElement("h6");
  title.setAttribute("class", "details-title");
  title.innerHTML = building.building;
  detailsContainer.appendChild(title);

  const div = document.createElement("div");
  div.className = "details-div";

  const link = document.createElement("a");
  link.href = `https://en.wikipedia.org/wiki/${building.link}`;
  link.className = "link";
  link.target = "_blank";
  link.innerHTML = "Wikipedia Link";

  const values = [
    ["Height", building.height_m],
    ["City", building.city],
    ["Country", building.country],
    ["Floors", building.floors],
    ["Completed", building.completed]
  ];

  for (let [key, value] of values) {
    const divider = document.createElement("hr");
    const p = document.createElement("p");
    const span1 = document.createElement("span");
    span1.setAttribute("class", "table-title");
    const span2 = document.createElement("span");
    span2.setAttribute("class", "table-body");
    span1.innerHTML = key;
    span2.innerHTML = value;
    p.append(divider, span1, span2);
    div.appendChild(p);
  }

  div.appendChild(link);

  detailsContainer.appendChild(div);
}

function createBottomLabel() {
  const bottomLabelContainer = document.getElementById(
    "bottom-label-container"
  );
  const p = document.createElement("p");
  p.className = "bottom-label";
  p.innerHTML = "-- Building heights specified in meters(m) --";
  bottomLabelContainer.appendChild(p);
}
