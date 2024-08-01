const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => { 
    try{
        let listing = await Listing.findById(req.params.id);
        
        if(!listing){
            throw new ExpressError(404, "Listing Not Found");
        }
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();
        req.flash("success" , "New Review Created!!");
        res.redirect(`/listings/${listing._id}`);
    
    }catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
    
};

module.exports.destroyReview = async (req, res) =>{
    let { id , reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted!!");

    res.redirect(`/listings/${id}`);
};