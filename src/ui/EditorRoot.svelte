<script lang="ts">
  import EditorTopBar from "./EditorTopBar.svelte";
</script>

<div class="editor-root" style="display: none;">
  <div class="window">
    <EditorTopBar />
    <div id="gm-editor-workspace"></div>
  </div>
</div>

<style lang="scss">
  @use "palette.scss";
  @use "sass:color";

  .editor-root {
    display: flex;
    position: absolute;

    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    font-family: futurept_book;
    color: white;

    pointer-events: none;
  }

  .window {
    flex-grow: 1;
    margin: 150px 200px;
    padding: 0 3px 3px 3px;

    background:
      linear-gradient(palette.$gm-white, palette.$gm-white) content-box,
      linear-gradient(
          palette.$gm-dark-blue,
          color.adjust(palette.$gm-dark-blue, $lightness: -10%)
        )
        border-box;

    border: solid 1px transparent;
    border-radius: 3px;

    pointer-events: auto;
  }

  #gm-editor-workspace {
    height: 700px;
  }
</style>
