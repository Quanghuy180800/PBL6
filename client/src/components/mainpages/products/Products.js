import React, {useContext, useEffect, useState} from 'react'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import Loading from '../utils/loading/Loading'
import axios from 'axios'
import Filters from './Filters'
import LoadMore from './LoadMore'
import Footer from '../../footer/Footer'
import ProductItem2 from '../utils/productItem/ProductItemA'

function Products() {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)
    const { getProducts } = state.productsAPI

    const handleCheck = (id) =>{
        products.forEach(product => {
            if(product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const deleteProduct = async(id, public_id) => {
        try {
            if(window.confirm("Do you want to remove product")){
            setLoading(true)
            const destroyImg = axios.post('/api/destroy', {public_id},{
                headers: {Authorization: token}
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: {Authorization: token}
            })

            await destroyImg
            await deleteProduct
            setCallback(!callback)
            setLoading(false)}
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const checkAll = () =>{
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () =>{
        products.forEach(product => {
            if(product.checked) deleteProduct(product._id, product.mainimg.public_id)
        })
    }

    useEffect(() => {
        getProducts()
    },[])

    if(loading) return <div><Loading /></div>
    return (
        <div>
       {
           isAdmin ?  <h3 className="pagename">Product Management</h3> : ""
       }
       {
           isAdmin ? '' :
           <div className="banner">
              <div className="opacity"></div> 
              <div className="introproduct">
                  <h1>Wellcome to my product</h1>
                  <p>????y l?? nh???ng s???n ph???m ???????c ch??ng t??i t??m ???????c tr??n c??c di???n ????n, 
                    v?? nh???ng l??ng ngh??? l??u n??m, hay t???i nh???ng b???o t??ng, c??c bu???i tri???n l??m.</p>
              </div>
           </div>
       }

       

        <Filters />

        {
            isAdmin && 
            <div className="delete-all">
                <span>Select all</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete ALL</button>
            </div>
        }
        
        {
            !isAdmin ?
        <div className="products">
            {
                products.map(product => {
                   
                    
                        return <ProductItem key={product._id} product={product}
                        isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                   
                })
            } 
        </div>
        :
        <div className="Adminproduct">
            {

                products.map(
                    product => {
                        return <ProductItem2 key={product._id} product={product}
                        isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                    }
                )
            }
            <h3>END!</h3>
        </div>
        }
        <LoadMore />
        {products.length === 0 && <Loading />}

        { isAdmin ? "":   
        <div className="phonecall">
            <p>To make an enquiry call <span>+0848071200</span></p>
        </div>
        }
        {
            isAdmin ? "" :  <Footer />
        }
       
        </div>

        

    )
}

export default Products
