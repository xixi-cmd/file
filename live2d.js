/* ----

# Pio SDK 2/3/4 support
# By: jupiterbjy
# Modify: journey-ad
# Last Update: 2021.5.4

To use this, you need to include following sources to your HTML file first.
With this script, you don't have to include `l2d.js`. Testing is done without it.
Basic usage is same with Paul-Pio.

Make sure to call `pio_refresh_style()` upon changing styles on anything related to 'pio-container' and it's children.

To change alignment, modify variable `pio_alignment` to either `left` or `right`, then call `pio_refresh_style()`.

<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi.js@5.3.6/dist/pixi.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/index.min.js"></script>

If you have trouble setting up this, check following example's sources.
https://jupiterbjy.github.io/PaulPio_PIXI_Demo/

---- */


function loadlive2d(canvas_id, json_object_or_url, on_load) {
        console.log("[Pio] Loading new model");

        const canvas = document.getElementById(canvas_id);

        if (canvas.width === 0) {
          canvas.removeAttribute("height");
          pio_refresh_style();
        }

        try {
          app.stage.removeChildAt(0);
        } catch (error) {}

        let model = PIXI.live2d.Live2DModel.fromSync(json_object_or_url);

        model.once("load", () => {
          app.stage.addChild(model);

          const containerWidth = canvas.width;
          const containerHeight = canvas.height;
          const modelWidth = model.width;
          const modelHeight = model.height;

          // 计算等比例缩放倍数
          const scaleX = containerWidth / modelWidth;
          const scaleY = containerHeight / modelHeight;
          const scale = Math.min(scaleX, scaleY) * 0.85;

          model.scale.set(scale);

          // 贴底部显示
          model.anchor.set(0.5, 1);
          model.x = containerWidth / 2;
          model.y = containerHeight;

          pio_refresh_style();

          model.on("hit", (hitAreas) => {
            if (hitAreas.includes("body")) {
              console.log("[Pio] Touch on body (SDK2)");
              model.motion("tap_body");
            } else if (hitAreas.includes("Body")) {
              console.log("[Pio] Touch on body (SDK3/4)");
              model.motion("Tap");
            } else if (hitAreas.includes("head") || hitAreas.includes("Head")) {
              console.log("[Pio] Touch on head");
              model.expression();
            }
          });

          on_load(model);
        });

        return model;
      }

      function _pio_initialize_container() {
        let pio_container = document.createElement("div");
        pio_container.classList.add("pio-container");
        pio_container.id = "pio-container";
        document.body.insertAdjacentElement("beforeend", pio_container);

        let pio_action = document.createElement("div");
        pio_action.classList.add("pio-action");
        pio_container.insertAdjacentElement("beforeend", pio_action);

        let pio_canvas = document.createElement("canvas");
        pio_canvas.id = "pio";
        pio_container.insertAdjacentElement("beforeend", pio_canvas);

        console.log("[Pio] Initialized container.");
      }

      function pio_refresh_style() {
        let pio_container = document
          .getElementsByClassName("pio-container")
          .item(0);

        pio_container.classList.remove("left", "right");
        pio_container.classList.add(pio_alignment);
      }

      function _pio_initialize_pixi() {
        _pio_initialize_container();

        app = new PIXI.Application({
          view: document.getElementById("pio"),
          transparent: true,
          autoStart: true,
        });

        pio_refresh_style();
      }

      let pio_alignment = "right";
      let app;
      window.addEventListener("DOMContentLoaded", _pio_initialize_pixi);
