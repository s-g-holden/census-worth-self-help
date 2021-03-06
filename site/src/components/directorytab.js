import React from "react"
import { css } from "@emotion/core"
import { navigate } from "@reach/router"
import { spacing } from "../utils/styles"
import { getSiteSpecificStyle } from "../utils/contenttransforms"

export default ({ node }) => {
  let title = node.frontmatter.title
  let link = node.fields.pagename + "/"
  let description = node.frontmatter.description

  const siteStyle = getSiteSpecificStyle();
  const siteSpecificColour = siteStyle.colour
  const siteSpecificGradient = siteStyle.gradient
  return (
    <div
      className="clickable"
      onClick={() => navigate("/" + link)}
      css={css`
        ${spacing.tab};
        box-shadow: 0 2px 4px 0 rgba(212, 212, 212, 0.5);
        border: solid 1px #ececed;
        ${siteSpecificGradient};
        border-left: 6px solid ${siteSpecificColour};
      `}
    >
      <div
        className="Card-heading-Style"
        data-testid="articletab-article-card"
        css={css`
          color: white;
          flex-grow: 1;
          font-weight: semi-bold;
        `}
      >
        {title}
      </div>
      <div
        className="Card-sub-head-Style-gray"
        css={css`
          padding-top: 6px;
          display: flex;
          flex-direction: vertical;
          line-height: 1.08;
          max-height: 42.12px; // line-height * font-size * 3
        `}
      >
        <div
          css={css`
            color: white;
            width: 70%;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-grow: 1;
          `}
        >
          {description}
        </div>
      </div>
    </div>
  )
}
