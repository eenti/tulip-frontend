import React, { useState } from 'react'
import { DataView, textStyle, Button } from '@1hive/1hive-ui'
import Loading from '../../Loading'
import { getKnownTokenImg } from '../../../utils/known-tokens'
import PairName from '../PairName'
import RewardComponent from '../RewardComponent'
import Fuse from 'fuse.js'
import DepositModal from '../DepositModal'

const FarmTable = props => {
  const [modalAction, setModalAction] = useState(false)
  const pairs = props.pairData.filter(id => {
    const temp = []
    for (const x of props.tableData) {
      temp.push(x.pair)
    }
    return temp.includes(id.id)
  })
  const addAPY = pairs.map(pair => {
    for (const x of props.tableData) {
      if (x.pair === pair.id) {
        return {
          ...pair,
          apy: x.apy,
          sushiHarvestedUSD: x.sushiHarvestedUSD,
          sushiHarvested: x.sushiHarvested,
          slpDeposited: x.slpDeposited,
          allocPoint: x.allocPoint,
          slpBalance: x.slpBalance,
          slpWithdrawn: x.slpWithdrawn,
        }
      }
    }
  })
  const fuse = new Fuse(addAPY, {
    keys: ['token0.name', 'token0.symbol', 'token1.name', 'token1.symbol'],
  })
  const results = fuse.search(props.searchValue)
  console.log(addAPY)
  const handleModalActions = () => {
    setModalAction(true)
  }
  const handleModalClose = () => {
    setModalAction(false)
  }
  console.log(modalAction)
  if (props.tableData.length === 0) {
    return <Loading />
  } else {
    return (
      <div
        css={`
          ${textStyle('body2')};
          font-family: 'Overpass', sans-serif;
          font-weight: 300;
          font-size: 18px;
        `}
      >
        <DataView
          fields={[
            'Asset',
            'Base Yield',
            'Reward Yield',
            'Total Yield',
            'Reward Asset',
            ' ',
          ]}
          css={`
            border-top: none;
          `}
          emptyState={{
            default: {
              displayLoader: false,
              title: 'Getting Pools',
              subtitle: null,
              illustration: <Loading />,
              clearLabel: null,
            },
            loading: {
              displayLoader: true,
              title: 'No data available.',
              subtitle: null,
              illustration: (
                <img
                  src="https://i1.wp.com/www.cssscript.com/wp-content/uploads/2014/10/iOS-OS-X-Style-Pure-CSS-Loading-Spinner.jpg?fit=400%2C300&ssl=1"
                  alt=""
                />
              ),
              clearLabel: null,
            },
          }}
          entries={props.searchValue ? results : addAPY}
          header
          renderEntry={({ id, token0, token1, apy }) => {
            const customLabel = `${token0.symbol}-${token1.symbol}`
            const baseYield = parseInt(apy.toFixed(2))
            const rewardYield = parseInt(apy.toFixed(2) * 2)
            const totalYield = parseInt(baseYield + rewardYield)
            const token0Img = getKnownTokenImg(token0.symbol)
            const token1Img = getKnownTokenImg(token1.symbol)
            const imgObj = {
              pair1: token0Img,
              pair2: token1Img,
            }
            console.log(imgObj)
            return [
              <PairName
                image={imgObj}
                name={customLabel}
                subheadline="Honeyswap"
              />,
              <p>{baseYield}%</p>,
              <p>{rewardYield}%</p>,
              <p>{totalYield}%</p>,
              <RewardComponent image={getKnownTokenImg('AG')} name="Agave" />,
              <React.Fragment>
                <Button
                  css={`
                    background: linear-gradient(90deg, #aaf5d4, #7ce0d6);
                  `}
                  id={customLabel}
                  label="Stake"
                  onClick={handleModalActions}
                />
                <DepositModal
                  modalAction={modalAction}
                  handleModalClose={handleModalClose}
                  tokenImg={imgObj}
                  pairName={customLabel}
                />
              </React.Fragment>,
            ]
          }}
        />
      </div>
    )
  }
}
export default FarmTable