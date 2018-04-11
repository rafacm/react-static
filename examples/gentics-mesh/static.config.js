import axios from 'axios'
import MeshApiClient from './src/mesh/mesh-api-client'

const MESH_HOST = 'http://localhost:8080'
const MESH_USERNAME = 'webclient'
const MESH_PASSWORD = 'webclient'
const MESH_PROJECT_NAME = 'demo'
const MESH_LANGUAGE = 'de'
const MESH_API_CLIENT_LOGGING = true

export default {
  getSiteData: () => ({
    title: 'GENTICS Mesh React Static Eyxample',
  }),
  getRoutes: async () => {
    const { data: posts } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    const meshApiClient = new MeshApiClient(MESH_HOST, MESH_PROJECT_NAME, MESH_LANGUAGE, MESH_API_CLIENT_LOGGING)
    const meshApiClientAsWebClientUser = await meshApiClient.login(MESH_USERNAME, MESH_PASSWORD)
    const automobilesCategoryNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/automobiles')
    const yatchsCategoryNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/yachts')
    const aircraftsCategoryNode = await meshApiClientAsWebClientUser.getNodeByWebRootPath('/aircrafts')
    const { data: allAutomobileNodes } = await meshApiClientAsWebClientUser.getChildrenForNode(automobilesCategoryNode.uuid)
    const { data: allYatchsNodes } = await meshApiClientAsWebClientUser.getChildrenForNode(yatchsCategoryNode.uuid)
    const { data: allAircraftNodes } = await meshApiClientAsWebClientUser.getChildrenForNode(aircraftsCategoryNode.uuid)
    //console.log('allAutomobileNodes: ', allAutomobileNodes)

    return [
      {
        path: '/',
        component: 'src/containers/Home',
      },
      {
        path: '/automobiles',
        component: 'src/containers/ProductList',
        getData: () => ({
          category: automobilesCategoryNode,
          items: allAutomobileNodes,
        }),
        children: allAutomobileNodes.map(item => ({
          path: `/${item.fields.slug}`,
          component: 'src/containers/ProductDetail',
          getData: () => ({
            item,
          }),
        })),
      },
      {
        path: '/yachts',
        component: 'src/containers/ProductList',
        getData: () => ({
          category: yatchsCategoryNode,
          items: allYatchsNodes,
        }),
        children: allYatchsNodes.map(item => ({
          path: `/${item.fields.slug}`,
          component: 'src/containers/ProductDetail',
          getData: () => ({
            item,
          }),
        })),
      },
      {
        path: '/aircrafts',
        component: 'src/containers/ProductList',
        getData: () => ({
          category: aircraftsCategoryNode,
          items: allAircraftNodes,
        }),
        children: allAircraftNodes.map(item => ({
          path: `/${item.fields.slug}`,
          component: 'src/containers/ProductDetail',
          getData: () => ({
            item,
          }),
        })),
      },
      {
        is404: true,
        component: 'src/containers/404',
      },
    ]
  },
}
