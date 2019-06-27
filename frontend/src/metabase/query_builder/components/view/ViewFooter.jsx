import React from "react";

import { t } from "ttag";
import cx from "classnames";
import styled from "styled-components";
import { Box, Flex } from "grid-styled";
import colors, { darken } from "metabase/lib/colors";

import Icon from "metabase/components/Icon";
import Tooltip from "metabase/components/Tooltip";

import ButtonBar from "metabase/components/ButtonBar";

import ViewSection from "./ViewSection";

import QuestionAlertWidget from "./QuestionAlertWidget";
import QueryDownloadWidget from "metabase/query_builder/components/QueryDownloadWidget";
import QuestionEmbedWidget from "metabase/query_builder/containers/QuestionEmbedWidget";
import QuestionRowCount from "./QuestionRowCount";

import {
  getVisualizationRaw,
  getIconForVisualizationType,
} from "metabase/visualizations";

const ViewFooter = ({
  question,
  result,
  className,
  isShowingChartTypeSidebar,
  isShowingChartSettingsSidebar,
  isShowingRawTable,
  onOpenChartType,
  onOpenModal,
  onCloseChartType,
  onOpenChartSettings,
  onCloseChartSettings,
  setUIControls,
  isObjectDetail,
  questionAlerts,
  visualizationSettings,
  isAdmin,
  isPreviewing,
  isResultDirty,
  isVisualized,
}) => {
  if (!result || isObjectDetail) {
    return null;
  }

  return (
    <ViewSection className={cx(className, "text-medium border-top")} py={1}>
      <ButtonBar
        className="flex-full"
        left={[
          <VizTypeButton
            question={question}
            result={result}
            selected={isShowingChartTypeSidebar}
            onClick={
              isShowingChartTypeSidebar ? onCloseChartType : onOpenChartType
            }
          />,
          <VizSettingsButton
            selected={isShowingChartSettingsSidebar}
            onClick={
              isShowingChartSettingsSidebar
                ? onCloseChartSettings
                : onOpenChartSettings
            }
          />,
        ]}
        center={
          isVisualized && (
            <VizTableToggle
              question={question}
              isShowingRawTable={isShowingRawTable}
              onShowTable={isShowingRawTable => {
                setUIControls({ isShowingRawTable });
              }}
            />
          )
        }
        right={[
          QuestionRowCount.shouldRender({ question, result, isObjectDetail }) &&
            !isPreviewing && (
              <QuestionRowCount
                key="row_count"
                className="mx1"
                question={question}
                isResultDirty={isResultDirty}
                result={result}
              />
            ),
          QueryDownloadWidget.shouldRender({ result, isResultDirty }) && (
            <QueryDownloadWidget
              key="download"
              className="mx1 hide sm-show"
              card={question.card()}
              result={result}
            />
          ),
          QuestionAlertWidget.shouldRender({
            question,
            visualizationSettings,
          }) && (
            <QuestionAlertWidget
              key="alerts"
              className="mx1 hide sm-show"
              question={question}
              questionAlerts={questionAlerts}
              onCreateAlert={() =>
                question.isSaved()
                  ? onOpenModal("create-alert")
                  : onOpenModal("save-question-before-alert")
              }
            />
          ),
          QuestionEmbedWidget.shouldRender({ question, isAdmin }) && (
            <QuestionEmbedWidget
              key="embed"
              className="mx1 hide sm-show"
              card={question.card()}
            />
          ),
        ]}
      />
    </ViewSection>
  );
};

const VizTypeButton = ({ className, question, result, selected, onClick }) => {
  // TODO: move this to QuestionResult or something
  const { CardVisualization } = getVisualizationRaw([
    { card: question.card(), data: result.data },
  ]);

  return (
    <span
      className="text-bold flex align-center text-brand bg-light-hover transition-background rounded px1 py1 cursor-pointer"
      onClick={onClick}
    >
      {`Change visualization`}
    </span>
  );
};

const VizSettingsButton = ({ className, selected, onClick }) => (
  <Tooltip tooltip={t`Visualization options`}>
    <Icon
      name="gear"
      className={cx(
        className,
        "cursor-pointer text-light text-brand-hover bg-light-hover transition-all rounded px1 py1",
        {
          "text-brand": selected,
        },
      )}
      onClick={onClick}
    />
  </Tooltip>
);

const Well = styled(Flex)`
  border-radius: 99px;
  &:hover {
    background-color: ${darken(colors["bg-medium"], 0.05)};
  }
  transition: background 300ms linear;
`;

Well.defaultProps = {
  px: "6px",
  py: "4px",
  align: "center",
  bg: colors["bg-medium"],
};

const ToggleIcon = styled(Flex)`
  cursor: pointer;
  background-color: ${props =>
    props.active ? colors["brand"] : "transparent"};
  color: ${props => (props.active ? "white" : "inherit")};
  border-radius: 99px;
`;

ToggleIcon.defaultProps = {
  p: "4px",
  px: "8px",
};

const VizTableToggle = ({ question, isShowingRawTable, onShowTable }) => {
  const vizIcon = getIconForVisualizationType(question.display());
  return (
    <Well onClick={() => onShowTable(!isShowingRawTable)}>
      <ToggleIcon active={isShowingRawTable}>
        <Icon name="table2" />
      </ToggleIcon>
      <ToggleIcon active={!isShowingRawTable}>
        <Icon name={vizIcon} />
      </ToggleIcon>
    </Well>
  );
};

export default ViewFooter;
