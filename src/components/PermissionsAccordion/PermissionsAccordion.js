import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import {
  Icon,
  Button,
  Accordion,
  Badge,
  List,
  Headline
} from '@folio/stripes/components';
import {
  IfPermission,
  stripesConnect,
  stripesShape,
} from '@folio/stripes-core';

import PermissionModal from './components/PermissionsModal';
import css from './PermissionsAccordion.css';

class ContainedPermissions extends React.Component {
  static propTypes = {
    expanded: PropTypes.bool.isRequired,
    initialValues: PropTypes.object,
    onToggle: PropTypes.func.isRequired,
    accordionId: PropTypes.string.isRequired,
    permToDelete: PropTypes.string.isRequired,
    permToModify: PropTypes.string.isRequired,
    permToRead: PropTypes.string.isRequired,
    stripes: stripesShape.isRequired,
    formName: PropTypes.string.isRequired,
    permissionsField: PropTypes.string.isRequired,
    filtersConfig: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node.isRequired,
        name: PropTypes.string.isRequired,
        cql: PropTypes.string.isRequired,
        filter: PropTypes.func.isRequired,
        values: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            displayName: PropTypes.element.isRequired,
            value: PropTypes.bool.isRequired,
          }),
        ).isRequired,
      })
    ).isRequired,
    visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    headlineContent: PropTypes.element.isRequired,
  };

  static defaultProps = {
    initialValues: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      permissionModalOpen: false,
    };
  }

  renderItem(item, index, showPerms) {
    return (
      <li
        key={item.id}
        data-permission-name={`${item.permissionName}`}
      >
        {
          showPerms
            ? `${item.permissionName} (${item.displayName})`
            : (item.displayName || item.permissionName)
        }
        <IfPermission perm={this.props.permToDelete}>
          <FormattedMessage id="ui-users.permissions.removePermission">
            {aria => (
              <Button
                buttonStyle="fieldControl"
                align="end"
                type="button"
                id={`clickable-remove-permission-${item.permissionName}`}
                onClick={() => this.removePermission(index)}
                aria-label={`${aria}: ${item.permissionName}`}
              >
                <Icon
                  icon="times-circle"
                  iconClassName={css.removePermissionIcon}
                  iconRootClass={css.removePermissionButton}
                />
              </Button>
            )}
          </FormattedMessage>
        </IfPermission>
      </li>
    );
  }

  renderList = ({ fields }) => {
    this.fields = fields;
    const showPerms = get(this.props.stripes, ['config', 'showPerms']);
    const listFormatter = (fieldName, index) => (this.renderItem(this.fields.get(index), index, showPerms));

    return (
      <List
        items={this.fields}
        itemFormatter={listFormatter}
        isEmptyMessage={<FormattedMessage id="ui-users.permissions.empty" />}
      />
    );
  };

  removePermission(index) {
    this.fields.remove(index);
    setTimeout(() => this.forceUpdate());
  }

  openPermissionModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ permissionModalOpen: true });
  };

  closePermissionModal = () => {
    this.setState({ permissionModalOpen: false });
  };

  render() {
    const {
      accordionId,
      expanded,
      onToggle,
      initialValues,
      permToModify,
      formName,
      permissionsField,
      filtersConfig,
      visibleColumns,
      headlineContent,
    } = this.props;

    const { permissionModalOpen } = this.state;
    const permissions = (initialValues || {}).subPermissions || [];

    if (!this.props.stripes.hasPerm(this.props.permToRead)) return null;

    const size = this.fields ? this.fields.length : permissions.length;

    return (
      <Accordion
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
        label={
          <Headline
            size="large"
            tag="h3"
          >
            {headlineContent}
          </Headline>
        }
        displayWhenClosed={<Badge>{size}</Badge>}
      >
        <FieldArray name={permissionsField} component={this.renderList} />
        <IfPermission perm={permToModify}>
          <Button
            type="button"
            align="end"
            bottomMargin0
            id="clickable-add-permission"
            onClick={this.openPermissionModal}
          >
            <FormattedMessage id="ui-users.permissions.addPermission" />
          </Button>
          {
            permissionModalOpen &&
            <PermissionModal
              formName={formName}
              permissionsField={permissionsField}
              open={permissionModalOpen}
              visibleColumns={visibleColumns}
              filtersConfig={filtersConfig}
              onClose={this.closePermissionModal}
            />
          }
        </IfPermission>
      </Accordion>
    );
  }
}

export default stripesConnect(ContainedPermissions);
