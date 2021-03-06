import { css } from "@emotion/core"
import { faRubleSign } from "@fortawesome/free-solid-svg-icons"

export const colors = {
  navy_normal: "rgb(0,61,89)",
  white: "rgb(255, 255, 255)",
  pale_lilac: "rgb(229, 229, 234)",
  golden_yellow: "rgb(248, 196, 30)",
  light_tan: "rgb(253, 239, 173)",
  black_two: "rgb(48, 48, 48)",
  white_two: "rgb(250, 250, 250)",
  footer_gray: "rgb(236, 236, 237)",
  primary_purple: "rgb(144, 32, 130)",
  primary_blue: "rgb(60, 56, 142)",
  secondary_teal: "rgb(0, 163, 166)",
  secondary_pink: "rgb(223, 6, 103)",
  dimmed: "rgba(0,61,89, 0.2)",
  error_red: "rgb(204,0,0)"
}

export const gradients = {
  navy_shine: css`
    background: linear-gradient(to left, ${colors.navy_normal}, #33637a);
  `,
  navy_shine_lighter: css`
    background: linear-gradient(to left, rgb(25, 80, 105), rgb(71, 114, 136));
  `,
  purple_shine: css`
    background: linear-gradient(to left, ${colors.primary_purple}, #bb2aaa);
  `,
  blue_shine: css`
    background: linear-gradient(to left, ${colors.primary_blue}, #64629e);
  `,
  teal_shine: css`
    background: linear-gradient(to left, ${colors.secondary_teal}, #08c6c9);
  `
}

export const spacing = {
  vert_aligned_flex_text: css`
    display: flex;
    justify-content: center;
    flex-direction: column;
  `,
  standard_vertical: css`
    padding: 15px 0px;
  `,
  large_vertical: css`
    padding: 30px 0px;
  `,
  tab: css`
    padding: 15px;
    min-height: 30px;
  `,
  desktop_max_width: "800px",
  page_padding: css`
    padding: 15px;
  `,
  in_page_element: css`
    padding: 5px 15px;
  `
}
