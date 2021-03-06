// @flow
import React from 'react';
import SocketIO from 'socket.io';
import { shell } from 'electron';
import ReactTooltip from 'react-tooltip';

import handleSocketData from '../util/handleSocketData';

import Log from './Log';
import Operations from './Operations';
import Assets from './Assets';
import Modules from './Modules';
import Problems from './Problems';
import Visualization from './Visualization';

import Row from '../components/Row';
import Box from '../components/Box';
import DoubleBox from '../components/DoubleBox';
import Container from '../components/Container';
import BoxHeader from '../components/BoxHeader';

const DEFAULT_PORT = 9838;

class Body extends React.PureComponent {
  state = {
    assets: null,
    chartAssets: null,
    chartData: null,
    problems: null,
    problemsError: false,
    progress: 0,
    sizes: null,
    sizesError: false,
    stats: {},
    status: 'idle',
    operations: '',
    log: '',
    breakpoint: 'large',
    modules: null,
    moduleSizes: null,
    assetSizes: null,
    totalAssetSizes: null,
    totalModuleSizes: null,
    totalAssetMinSizes: null,
    totalModuleMinSizes: null,
    modulesLoading: false,
    assetsLoading: false,
    problemsLoading: false,
  };
  componentWillMount() {
    try {
      this.server = new SocketIO(DEFAULT_PORT);
    } catch (e) {
      alert(e); // eslint-disable-line no-alert
    }
    if (this.server) {
      this.server.on('connection', socket => {
        socket.on('message', message => {
          this.setState(state => handleSocketData(state, message));
          ReactTooltip.rebuild();
        });
      });
    }
  }
  componentDidMount() {
    window.addEventListener('resize', this.checkLayout);
    this.checkLayout();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkLayout);
    if (this.server) {
      this.server.disconnect();
    }
  }
  checkLayout = () => {
    let breakpoint;
    const width = window.innerWidth;

    if (width > 1200) {
      breakpoint = 'large';
    } else if (width > 768) {
      breakpoint = 'medium';
    } else {
      breakpoint = 'small';
    }

    if (breakpoint !== this.state.breakpoint) {
      this.setState({ breakpoint });
    }
  };
  openUrl = () => {
    shell.openExternal('http://www.formidable.com');
  };
  render() {
    return this.props.vizActive
      ? <Container>
          <Row>
            <Box style={{ display: 'flex' }} key="viz">
              <Visualization
                data={this.state.chartData}
                assets={this.state.chartAssets}
                stats={this.state.stats}
                loading={this.state.modulesLoading}
              />
            </Box>
          </Row>
          <BoxHeader
            style={{ margin: '20px auto 0px', animation: 'none', opacity: 1 }}
          >
            Artisanally hand-crafted at{' '}
            <a
              style={{ color: '#00bdff' }}
              href="javascript:void(0)"
              onClick={this.openUrl}
            >
              Formidable
            </a>
          </BoxHeader>
          <ReactTooltip place="top" type="error" effect="solid" />
        </Container>
      : <Container size={this.state.breakpoint}>
          <Row size={this.state.breakpoint}>
            <DoubleBox size={this.state.breakpoint}>
              <Log log={this.state.log} />
            </DoubleBox>
            <Box style={{ display: 'flex' }} size={this.state.breakpoint}>
              <Operations
                stats={this.state.stats}
                status={this.state.status}
                progress={this.state.progress}
                operations={this.state.operations}
                totalAssetSizes={this.state.totalAssetSizes}
                totalModuleSizes={this.state.totalModuleSizes}
                totalAssetMinSizes={this.state.totalAssetMinSizes}
                totalModuleMinSizes={this.state.totalModuleMinSizes}
              />
            </Box>
          </Row>
          <Row size={this.state.breakpoint}>
            <Box size={this.state.breakpoint}>
              <BoxHeader>Modules</BoxHeader>
              <Modules
                modules={this.state.modules}
                moduleSizes={this.state.moduleSizes}
                loading={this.state.modulesLoading}
                sizesError={this.state.sizesError}
              />
            </Box>
            <Box size={this.state.breakpoint}>
              <BoxHeader>Assets</BoxHeader>
              <Assets
                assets={this.state.assets}
                assetSizes={this.state.assetSizes}
                loading={this.state.assetsLoading}
                sizesError={this.state.sizesError}
              />
            </Box>
            <Box size={this.state.breakpoint}>
              <BoxHeader>Problems</BoxHeader>
              <Problems
                problems={this.state.problems}
                problemsError={this.state.problemsError}
                loading={this.state.problemsLoading}
              />
            </Box>
          </Row>
          <BoxHeader
            style={{ margin: '20px auto 0px', animation: 'none', opacity: 1 }}
          >
            Artisanally hand-crafted at{' '}
            <a
              style={{ color: '#00bdff' }}
              href="javascript:void(0)"
              onClick={this.openUrl}
            >
              Formidable
            </a>
          </BoxHeader>
          <ReactTooltip place="top" type="error" effect="solid" />
        </Container>;
  }
}
export default Body;
