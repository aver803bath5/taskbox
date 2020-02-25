import React, { Fragment } from "react";
import { AddonPanel, ActionBar } from "@storybook/components";
import { addons, types } from "@storybook/addons";
import { useParameter, useStorybookState, useAddonState } from "@storybook/api";
import { styled } from "@storybook/theming";

const getUrl = input => {
  return typeof input === "string" ? input : input.url;
};

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none",
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain",
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    //  do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

export const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter("assets", []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState("my/design-assets", 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0 && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register("my/design-assets", () => {
  addons.add("design-assets", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
