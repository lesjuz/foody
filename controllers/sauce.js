const Sauce=require('../models/sauce')
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: url + '/images/' + req.file.filename,
        heat: req.body.sauce.heat,
        likes:0,
        dislikes:0,
        usersLiked:[],
        usersDisliked:[],
        userId: req.body.sauce.userId,

    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            mainPepper: req.body.sauce.mainPepper,
            imageUrl: url + '/images/' + req.file.filename,
            heat: req.body.sauce.heat,
            userId: req.body.sauce.userId,
        };

    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            mainPepper: req.body.mainPepper,
            imageUrl: req.body.imageUrl,
            heat: req.body.heat,
            userId: req.body.userId,
        };

    }
    Sauce.updateOne({_id: req.params.id}, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce= (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then( (sauce) => {
        res.status(200).json(sauce);
    }).catch( (error) => {
        res.status(404).json({
            error: error
        });
    });
};

exports.getAllSauce= (req, res, next) => {
    Sauce.find().then( (sauces) => {
        res.status(200).json(sauces);
    }).catch( (error) => {
        res.status(400).json({
            error: error
        });
    });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({_id: req.params.id}).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    );
};
exports.likeSauce=(req,res,next)=>{
    Sauce.findOne({_id: req.params.id}).then(
        (sauce) => {
            const like=req.body.like;
            console.log(req.body.userId) ;
            if(sauce.usersLiked.includes(req.body.userId)&& like==-1)
            {
             sauce.likes -=1;
             sauce.dislikes +=1;
             sauce.usersDisliked.push(req.body.userId);
             let index = sauce.usersLiked.indexOf(req.body.userId);
                if (index > -1) {
                    sauce.usersLiked.splice(index, 1);
                }
            }
            else if (sauce.usersDisliked.includes(req.body.userId)&& like==1){
                sauce.likes +=1;
                sauce.dislikes -=1;
                sauce.usersLiked.push(req.body.userId);
                let index = sauce.usersDisliked.indexOf(req.body.userId);
                if (index > -1) {
                    sauce.usersDisliked.splice(index, 1);
                }

            }
            else if(!sauce.usersDisliked.includes(req.body.userId)&&!sauce.usersLiked.includes(req.body.userId)){
                if(like==1){
                    sauce.likes +=1;
                    sauce.usersLiked.push(req.body.userId);
                }
                else if(like==-1){
                    sauce.dislikes +=1;
                    sauce.usersDisliked.push(req.body.userId);
                }
            }
            Sauce.updateOne({_id: req.params.id}, sauce).then(
                () => {
                    res.status(201).json({
                        message: 'Sauce updated successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(400).json({
                        error: error
                    });
                }
            );
        }
    );


};
