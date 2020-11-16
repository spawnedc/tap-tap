// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict"

// Script code to inject on page
// Selects images then returns array of their currentSrc
const scriptCode = `(function() {
  const images = Array.from(document.querySelectorAll('img.obs-media'))
  const videos = Array.from(document.querySelectorAll('video.vjs-tech'))

  const imageSources = images.map(image => image.currentSrc)
  const videoSources = videos.map(video => video.currentSrc)
  
  return {
    images: imageSources,
    videos: videoSources,
  }
})();`

// Grabs the imageDiv from the popup
const imageDiv = document.getElementById("image_div")
const btnDownloadImages = document.getElementById("btn-download-images")
const btnDownloadVideos = document.getElementById("btn-download-videos")
const btnDownloadAll = document.getElementById("btn-download-all")

const downloadList = (list) =>
  list.forEach((url) => chrome.downloads.download({ url }))

const setUp = ({ images, videos }) => {
  if (images.length) {
    btnDownloadImages.addEventListener("click", () => downloadList(images))
    btnDownloadImages.innerText = `Download ${images.length} images`
    btnDownloadImages.classList.add("visible")
  }

  if (videos.length) {
    btnDownloadVideos.addEventListener("click", () => downloadList(videos))
    btnDownloadVideos.innerText = `Download ${videos.length} videos`
    btnDownloadVideos.classList.add("visible")
  }

  if (images.length && videos.length) {
    btnDownloadAll.addEventListener("click", () =>
      downloadList([...images, ...videos])
    )
    btnDownloadAll.innerText = "Download all media"
    btnDownloadAll.classList.add("visible")
  }
}

// Runs script when popup is opened
chrome.tabs.executeScript({ code: scriptCode }, (result) => setUp(result[0]))
