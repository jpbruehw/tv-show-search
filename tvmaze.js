"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
$("button[type=submit]").on("click", (e) => {
  e.preventDefault();
  const query = $("#searchForm-term").val();
  getShowsByTerm(query);
});
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const url = `http://api.tvmaze.com/search/shows?q=${term}`;
  const res = await axios.get(url);
  const showArr = [];
  //Loop over response data
  for (let result of res.data) {
    const { id, name, summary, image } = result.show;
    const imgURL = image ? image.medium : "";
    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Summary:", summary);
    console.log("Image:", image);
    console.log("------------------------");

    showArr.push({ id, name, summary, image: imgURL });
  }
  populateShows(showArr);
  // for (let show of showArr) {
  //   getEpisodesOfShow(show.id);
  // }
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(`
      <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
        <div class="media">
          <img src="${show.image}" class="w-25 me-3">
          <div class="media-body">
            <h5 class="text-primary">${show.name}</h5>
            <div><small>${show.summary}</small></div>
            <button class="btn btn-outline-light btn-sm Show-getEpisodes">
              Episodes
            </button>
          </div>
        </div>
      </div>
    `);
    $show.find(".Show-getEpisodes").on("click", () => {
      const showId = $(this).closest(".Show").data("show-id");
      console.log("Clicked Show ID:", showId);
      getEpisodesOfShow(showId);
    });
    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const url = `https://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(url);
  const episodes = [];

  for (let episode of res.data) {
    const { id, name, season, number } = episode;
    console.log("ID:", id);
    console.log("Name:", name);
    console.log("Summary:", season);
    console.log("Image:", number);
    console.log("------------------------");
    episodes.push({ id, name, season, number });
  }

  populateEpisodes(episodes);
}

/** Write a clear docstring for this function... */
function populateEpisodes(episodes) {
  const $episodesList = $("#episodesList");
  $episodesList.empty();

  for (let episode of episodes) {
    const { id, name, season, number } = episode;

    const $episodeItem = $("<li>", {
      text: `${name} - Season ${season}, Episode ${number}, Episode ID: ${id}`,
    });
    $episodesList.append($episodeItem);
  }

  $("#episodesArea").show();
}
