import React from "react";
import { DataTable } from "teselagen-react-components";
import CutsiteFilter from "../CutsiteFilter";
import Ladder from "./Ladder";
import DigestContainer from "./DigestContainer";
import getCutsiteType from "./getCutsiteType";
import { Tabs2, Tab2, Button, InputGroup, Intent } from "@blueprintjs/core";

export class DigestTool extends React.Component {
  state = { selectedTab: "virtualDigest" };
  render() {
    const {
      editorName,
      height = "100%",
      lanes,
      handleDigestSave,
      digestTool: { selectedFragment }
    } = this.props;
    const { selectedTab } = this.state;
    // console.log("rest:", rest);
    return (
      <div style={{ height, overflow: "auto", padding: 10 }}>
        <div style={{ display: "flex", marginBottom: 10 }}>
          <InputGroup placeholder={"My Digest"} />
          <Button
            intent={Intent.PRIMARY}
            onClick={() => {
              handleDigestSave({});
            }}
            style={{ marginLeft: 5 }}
          >
            {" "}
            Save
          </Button>
        </div>
        Choose your enzymes:
        <CutsiteFilter editorName={editorName} />
        <br />
        <Tabs2
          selectedTabId={selectedTab}
          onChange={id => {
            this.setState({ selectedTab: id });
          }}
        >
          <Tab2
            title={"Virtual Digest"}
            id={"virtualDigest"}
            panel={<Ladder {...this.props} editorName={editorName} />}
          />
          <Tab2
            title={"Digest Info"}
            id={"table"}
            panel={
              <DataTable
                noRouter
                isSimple
                maxHeight={400}
                // noFooter
                withSearch={false}
                onSingleRowSelect={({ onFragmentSelect }) => {
                  onFragmentSelect();
                }}
                reduxFormSelectedEntityIdMap={{
                  input: {
                    value: {
                      [selectedFragment]: true
                    },
                    onChange: () => {}
                  }
                }}
                formName={"digestInfoTable"}
                entities={lanes[0].map(
                  ({ id, cut1, cut2, start, end, size, ...rest }) => {
                    return {
                      ...rest,
                      id,
                      start,
                      end,
                      length: size,
                      leftCutter: cut1.restrictionEnzyme.name,
                      rightCutter: cut2.restrictionEnzyme.name,
                      leftOverhang: getCutsiteType(cut1.restrictionEnzyme),
                      rightOverhang: getCutsiteType(cut2.restrictionEnzyme)
                    };
                  }
                )}
                schema={schema}
              />
            }
          />
        </Tabs2>
        <br />
      </div>
    );
  }
}
const schema = {
  fields: [
    { width: 60, path: "start", displayName: "Start", type: "string" },
    { width: 60, path: "end", displayName: "End", type: "string" },
    { width: 70, path: "length", displayName: "Length", type: "string" },
    { path: "leftCutter", displayName: "Left Cutter", type: "string" },
    { path: "leftOverhang", displayName: "Left Overhang", type: "string" },
    { path: "rightCutter", displayName: "Right Cutter", type: "string" },
    { path: "rightOverhang", displayName: "Right Overhang", type: "string" }
  ]
};

export default DigestContainer(DigestTool);

//Component Development Overseen by Patrick Michelson
