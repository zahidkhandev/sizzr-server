const router = require('express').Router();
const Appointment = require('../../models/Appointment');
const CryptoJS = require('crypto-js');
const verify = require('../../../verifyToken');
const createError = require('http-errors');
const mongoose = require('mongoose')
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../../errors/index');


const createAppointment = async (req, res, next) => {
    req.body.createdBy = req.user.userId;
    const appointment = await Appointment.create(req.body);
    res.status(StatusCodes.CREATED).json({ appointment })

}


const getAppointment = async (req, res, next) => {
    const appointmentId = req.params.id;
    const userId = req.user.userId
    const appointment = await Appointment.findOne({ _id: appointmentId, createdBy: userId })

    if (!appointment) {
        throw new NotFoundError('Appointment not found')
    }

    res.status(StatusCodes.OK).json({ appointment })
}

const getAll = async (req, res) => {
    const appointments = await Appointment.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ appointments, count: appointments.length })
}

const getAppointmentStats = async (req, res) => {

}

const deleteAppointment = async (req, res, next) => {
    const { userId } = req.user
    const appointmentId = req.params.id;

    const appointment = await Appointment.findOneAndRemove({
        _id: appointmentId,
        createdBy: userId,
    })

    if (!appointment) {
        throw new NotFoundError('Appointment not found')
    }
    res.status(StatusCodes.OK).json({ msg: 'Deleted sucessfully' })
}


const patchAppointment = async (req, res, next) => {

    const { userId } = req.user
    const appointmentId = req.params.id;
    const { status, startTime, endTime, paid, paymentType, servicesSelected } = req.body

    if (!status && !startTime && !endTime && !paid && !paymentType && !servicesSelected) {
        throw new BadRequestError('Atleast one field from the following is required to perform this action: Status, Start Time, End Time, Paid(Boolean), Payment Type, Services Selected')
    }

    const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!appointment) {
        throw new NotFoundError('Appointment not found')
    }
    res.status(StatusCodes.OK).json({ appointment })

}





module.exports = {
    getAppointment,
    getAll,
    getAppointmentStats,
    deleteAppointment,
    patchAppointment,
    createAppointment
}