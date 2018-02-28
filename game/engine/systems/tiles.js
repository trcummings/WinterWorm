// (ns chocolatier.engine.systems.tiles
//   (:require [goog.net.XhrIo :as xhr]
//             [chocolatier.utils.logging :as log]
//             [chocolatier.engine.pixi :as pixi]))
//
// (defn screen-offset
//   [m x y]
//   (assoc m
//     :screen-x (+ (:screen-x m) x)
//     :screen-y (+ (:screen-y m) y)))
//
// (defn transpose-tiles
//   [tiles offset-x offset-y]
//   (map #(screen-offset % offset-x offset-y) tiles))
//
// (defn render-tiles [this state]
//   (let [{:keys [sprite screen-x screen-y]} this]
//     (when (or (not= (.-position.x sprite) screen-x)
//               (not= (.-position.y sprite) screen-y))
//       (set! (.-position.x sprite) screen-x)
//       (set! (.-position.y sprite) screen-y)
//       (assoc this :sprite sprite))))
//
// (defn create-tile!
//   "Adds a tile to the stage and returns the hashmap representation
//    of a tile."
//   ([tileset-texture
//     width height
//     map-x map-y         ;; coords on the grid i.e 0,1
//     screen-x screen-y   ;; postiion on the screen
//     tileset-x tileset-y ;; position on the tileset image
//     ]
//    (create-tile! tileset-texture
//                  width height
//                  map-x map-y
//                  screen-x screen-y
//                  tileset-x tileset-y
//                  {}))
//   ([tileset-texture
//     width height
//     map-x map-y
//     screen-x screen-y
//     tileset-x tileset-y
//     attributes]
//    (let [frame (new js/PIXI.Rectangle tileset-x tileset-y width height)
//          texture (new js/PIXI.Texture (.-baseTexture tileset-texture) frame)
//          sprite (new js/PIXI.Sprite texture)]
//      ;; Set the position on the screen
//      (set! (.-position.x sprite) screen-x)
//      (set! (.-position.y sprite) screen-y)
//      ;; Combine the required fields with any additional attributes
//      {:sprite sprite
//       :height height
//       :width width
//       :map-x map-x :map-y map-y
//       :screen-x screen-x :screen-y screen-y
//       :attributes attributes})))
//
// (defn create-tiles-from-spec!
//   "Create tiles from a map-spec, a 1 dimensional array where the
//    value of the item represents it's location in the tile set and
//    the index of the item represents it's location in the tile map.
//    Example of a 4 by 4 map spec:
//    [0 1 2 0
//     0 1 1 1
//     1 1 2 0
//     0 1 1 0]
//     Args:
//     - map-w: number of tiles wide
//     - map-h: number of tiles high
//     - tile-properties: attributes for each tile keyed by tile index
//     - tile-h: pixel height of a tile
//     - tile-w: pixel width of a tile
//     - tileset-h: number of tiles high in the tileset
//     - tileset-w: number of tiles wide in the tileset
//     - map-spec: a one dimensional array of integers"
//   [renderer stage tileset-texture
//    map-w map-h
//    tile-properties
//    tileset-w tileset-h
//    tile-px-w tile-px-h
//    map-spec
//    z-index
//    accum
//    & {:keys [offset-x offset-y]
//       :or {offset-x 0 offset-y 0}}]
//   (let [container (pixi/mk-display-object-container)
//         width-px (* map-w tile-px-w)
//         height-px (* map-h tile-px-h)]
//     (log/debug "Creating tiles from spec")
//     (loop [tile-specs (map-indexed vector map-spec)]
//       (if-let [[indx tile-pos] (first tile-specs)]
//         (if-not (zero? tile-pos)
//           (let [attributes (get tile-properties (keyword (str tile-pos)))
//                 map-row (js/Math.floor (/ indx map-w))
//                 map-col (if (> (inc indx) map-w)
//                           (- indx (* map-row map-w))
//                           indx)
//                 map-x (* map-col tile-px-w)
//                 map-y (* map-row tile-px-h)
//                 ;; Tile positions are indexed to 1 where 0 denotes
//                 ;; no tile so we have to decrement the tile number
//                 ;; Tiled specifies
//                 tileset-pos (dec tile-pos)
//                 tileset-row (js/Math.floor (/ tileset-pos tileset-w))
//                 tileset-col (if (> (inc tileset-pos) tileset-w)
//                               (- tileset-pos (* tileset-row tileset-w))
//                               tileset-pos)
//                 tileset-x (* tileset-col tile-px-w)
//                 tileset-y (* tileset-row tile-px-h)
//                 tile (create-tile! tileset-texture
//                                    tile-px-w tile-px-h
//                                    map-row map-col
//                                    map-x map-y
//                                    tileset-x tileset-y
//                                    attributes)]
//             (pixi/add-child! container (:sprite tile))
//             ;; Add to the accumulator
//             (.push accum tile)
//             (recur (rest tile-specs)))
//           (recur (rest tile-specs)))
//         (let [sprite (pixi/render-from-object-container! renderer stage container)]
//           (log/debug "Rendering tile map container")
//           (set! (.-position.z sprite) z-index)
//           accum)))))
//
// (defn mk-tiles-from-tilemap!
//   "Returns a collection of tile hashmaps according to the spec.
//    Args:
//    - state: The game state
//    - renderer: The rendering engine object
//    - stage: The rendering engine stage object
//    - loader: The preloaded asset cache
//    - tilemap: A spec for the tilemap as exported from Tiled
//      See http://www.mapeditor.org/ for more"
//   [state renderer stage loader tilemap]
//   (let [{:keys [width
//                 height
//                 layers
//                 tilesets
//                 tileheight
//                 tilewidth]} tilemap
//         {:keys [image
//                 imageheight
//                 imagewidth
//                 tileproperties]} (first tilesets)
//         tileset-width (/ imagewidth tilewidth)
//         tileset-height (/ imageheight tileheight)
//         ;; WARNING: This assumes there is only one tileset
//         ;; for the map
//         img-path (->> tilesets first :image)
//         img (aget (.-resources loader) image)
//         tileset-texture (aget img "texture")]
//     (log/debug "Making tiles from tile map")
//     ;; Draw tiles from all layers of the tile map
//     (assoc-in state [:state :tiles]
//               (loop [layers layers
//                      accum (array)
//                      z-index 0]
//                 (if-let [l (first layers)]
//                   (recur (rest layers)
//                          (create-tiles-from-spec! renderer
//                                                   stage
//                                                   tileset-texture
//                                                   width
//                                                   height
//                                                   tileproperties
//                                                   tileset-width tileset-height
//                                                   tilewidth tileheight
//                                                   (:data l)
//                                                   z-index
//                                                   accum)
//                          (inc z-index))
//                   accum)))))
//
// (defn load-tilemap
//   "Async load a json tilemap at the url. Calls callback function with the
//    tilemap as a hashmap"
//   [url callback]
//   (xhr/send url #(callback
//                   (js->clj (.getResponseJson (.-target %))
//                            :keywordize-keys true))))
//
// (defn tile-system
//   "Update the tile map"
//   [state]
//   ;; TODO do something with tiles beyond drawing them once
//   ;; (let [tiles (-> state :state :tiles)]
//   ;;   (assoc-in state [:state :tiles] tiles))
//   state)
//
// @flow

// system for handling a tilemap
import { makeId } from '../util';
import { SYSTEMS } from '../symbols';

import type { System, GameState } from '../types';

const TILES = 'tiles';

const tiles: System = {
  label: TILES,
  id: makeId(SYSTEMS),
  fn: (state: GameState): GameState => {
    console.log('lol');

    return state;
  },
};

export default tiles;
