<script lang="ts"></script>

<menu>
  <button>File</button>
  <button>Edit</button>
  <button>View</button>
</menu>

<style lang="scss">
  @use "palette.scss";
  @use "sass:color";

  menu {
    margin: 0;
    padding: 0 10px;

    background: radial-gradient(
      100% 800% at 50% 300%,
      color.adjust(palette.$gm-dark-blue, $alpha: -0.8) 20%,
      palette.$gm-dark-blue 55%
    );

    border-bottom: 2px solid color.adjust(palette.$gm-dark-blue, $alpha: -0.9);
  }

  button {
    width: 70px;
    height: 35px;

    border: none;
    font: inherit;
    color: white;

    background: radial-gradient(transparent, transparent);

    transition: background ease-out 100ms;

    &:hover {
      background: radial-gradient(
        60% 50% at 50% 110%,
        #527493c7,
        color.adjust(#527493c7, $alpha: -1)
      );
      cursor: pointer;
    }

    &::after {
      content: "";
      display: block;

      position: relative;
      top: 6px;

      width: 100%;
      height: 1px;

      background: linear-gradient(to right, transparent, white, transparent);
    }
  }
</style>
